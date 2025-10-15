from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import StreamingResponse
from typing import Optional
from models import (
    UserCreate, UserLogin, User, UserResponse, Token,
    Assessment, AssessmentCreate, AssessmentResponse, AssessmentHistory, ShareLink
)
from auth import get_password_hash, verify_password, create_access_token, decode_access_token
from datetime import datetime, timedelta
from pdf_service import generate_assessment_pdf, generate_share_token

auth_router = APIRouter(tags=["Authentication"])
assessment_router = APIRouter(tags=["Assessments"])


# Dependency to get database
def get_db(request: Request):
    return request.state.db


# Dependency to get current user from token
async def get_current_user(authorization: Optional[str] = Header(None), request: Request = None) -> dict:
    """Get current user from authorization header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    # Get user from database
    db = request.state.db
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


# Auth routes
@auth_router.post("/auth/register", response_model=Token)
async def register(user_create: UserCreate, request: Request):
    """Register a new user."""
    db = request.state.db
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_create.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user = User(
        email=user_create.email,
        name=user_create.name,
        preferred_language=user_create.preferred_language
    )
    
    # Hash password and store
    user_dict = user.dict()
    user_dict["password_hash"] = get_password_hash(user_create.password)
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user.dict())
    )


@auth_router.post("/auth/login", response_model=Token)
async def login(user_login: UserLogin, request: Request):
    """Login user and return token."""
    db = request.state.db
    
    # Find user
    user = await db.users.find_one({"email": user_login.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(user_login.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            preferred_language=user["preferred_language"],
            created_at=user["created_at"]
        )
    )


@auth_router.get("/auth/me", response_model=UserResponse)
async def get_me(request: Request, authorization: Optional[str] = Header(None)):
    """Get current user info."""
    user = await get_current_user(authorization, request)
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        preferred_language=user["preferred_language"],
        created_at=user["created_at"]
    )


# Assessment routes
@assessment_router.post("/assessments/save", response_model=AssessmentResponse)
async def save_assessment(
    assessment_create: AssessmentCreate,
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Save a new assessment result."""
    user = await get_current_user(authorization, request)
    db = request.state.db
    
    # Calculate overall score
    scores = []
    results = assessment_create.results
    
    if results.memory_accuracy is not None:
        scores.append(results.memory_accuracy)
    if results.attention_accuracy is not None:
        scores.append(results.attention_accuracy)
    if results.reaction_score is not None:
        scores.append(results.reaction_score)
    
    overall_score = sum(scores) / len(scores) if scores else 0
    
    # Determine risk level
    if overall_score >= 75:
        risk_level = "Low"
    elif overall_score >= 50:
        risk_level = "Moderate"
    else:
        risk_level = "High"
    
    # Create assessment
    assessment = Assessment(
        user_id=user["id"],
        results=results,
        overall_score=overall_score,
        risk_level=risk_level
    )
    
    await db.assessments.insert_one(assessment.dict())
    
    return AssessmentResponse(**assessment.dict())


@assessment_router.get("/assessments/history", response_model=AssessmentHistory)
async def get_assessment_history(
    request: Request,
    authorization: Optional[str] = Header(None),
    limit: int = 10,
    skip: int = 0
):
    """Get user's assessment history."""
    user = await get_current_user(authorization, request)
    db = request.state.db
    
    # Get assessments
    cursor = db.assessments.find({"user_id": user["id"]}).sort("test_date", -1).skip(skip).limit(limit)
    assessments = await cursor.to_list(length=limit)
    
    # Get total count
    total_count = await db.assessments.count_documents({"user_id": user["id"]})
    
    assessment_responses = [AssessmentResponse(**assessment) for assessment in assessments]
    
    return AssessmentHistory(
        assessments=assessment_responses,
        total_count=total_count
    )


@assessment_router.get("/assessments/latest", response_model=AssessmentResponse)
async def get_latest_assessment(
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Get user's latest assessment."""
    user = await get_current_user(authorization, request)
    db = request.state.db
    
    assessment = await db.assessments.find_one(
        {"user_id": user["id"]},
        sort=[("test_date", -1)]
    )
    
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessments found")
    
    return AssessmentResponse(**assessment)


@assessment_router.get("/assessments/{assessment_id}/pdf")
async def generate_assessment_report(
    assessment_id: str,
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Generate and download PDF report for an assessment."""
    user = await get_current_user(authorization, request)
    db = request.state.db
    
    # Get assessment
    assessment = await db.assessments.find_one({"id": assessment_id, "user_id": user["id"]})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Generate PDF
    pdf_buffer = generate_assessment_pdf(assessment, user)
    
    # Return as downloadable file
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=cognitive_assessment_{assessment_id[:8]}.pdf"
        }
    )


@assessment_router.post("/assessments/{assessment_id}/share")
async def create_share_link(
    assessment_id: str,
    request: Request,
    authorization: Optional[str] = Header(None),
    expires_hours: int = 48
):
    """Create a shareable link for an assessment (expires in 48 hours by default)."""
    user = await get_current_user(authorization, request)
    db = request.state.db
    
    # Verify assessment belongs to user
    assessment = await db.assessments.find_one({"id": assessment_id, "user_id": user["id"]})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Check if share link already exists
    existing_link = await db.share_links.find_one({
        "assessment_id": assessment_id,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if existing_link:
        return {
            "share_token": existing_link["token"],
            "expires_at": existing_link["expires_at"],
            "share_url": f"/shared-report/{existing_link['token']}"
        }
    
    # Create new share link
    share_link = ShareLink(
        assessment_id=assessment_id,
        token=generate_share_token(),
        expires_at=datetime.utcnow() + timedelta(hours=expires_hours)
    )
    
    await db.share_links.insert_one(share_link.dict())
    
    return {
        "share_token": share_link.token,
        "expires_at": share_link.expires_at,
        "share_url": f"/shared-report/{share_link.token}"
    }


@assessment_router.get("/reports/shared/{token}")
async def get_shared_report(
    token: str,
    request: Request
):
    """Get a shared assessment report (no authentication required)."""
    db = request.state.db
    
    # Find share link
    share_link = await db.share_links.find_one({"token": token})
    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")
    
    # Check if expired
    if share_link["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Share link has expired")
    
    # Get assessment
    assessment = await db.assessments.find_one({"id": share_link["assessment_id"]})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Get user info (limited)
    user = await db.users.find_one({"id": assessment["user_id"]})
    
    # Increment access count
    await db.share_links.update_one(
        {"token": token},
        {"$inc": {"accessed_count": 1}}
    )
    
    # Return assessment data with limited user info
    return {
        "assessment": AssessmentResponse(**assessment),
        "patient_name": user.get("name", "N/A") if user else "N/A",
        "shared_at": share_link["created_at"],
        "expires_at": share_link["expires_at"]
    }


@assessment_router.get("/reports/shared/{token}/pdf")
async def download_shared_report_pdf(
    token: str,
    request: Request
):
    """Download PDF for a shared assessment report."""
    db = request.state.db
    
    # Find share link
    share_link = await db.share_links.find_one({"token": token})
    if not share_link:
        raise HTTPException(status_code=404, detail="Share link not found")
    
    # Check if expired
    if share_link["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Share link has expired")
    
    # Get assessment
    assessment = await db.assessments.find_one({"id": share_link["assessment_id"]})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Get user info
    user = await db.users.find_one({"id": assessment["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate PDF
    pdf_buffer = generate_assessment_pdf(assessment, user)
    
    # Increment access count
    await db.share_links.update_one(
        {"token": token},
        {"$inc": {"accessed_count": 1}}
    )
    
    # Return as downloadable file
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=shared_assessment_{share_link['assessment_id'][:8]}.pdf"
        }
    )

