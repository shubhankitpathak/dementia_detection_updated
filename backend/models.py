from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid


class UserBase(BaseModel):
    email: EmailStr
    name: str
    preferred_language: str = "en"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    preferred_language: str
    created_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class AssessmentResult(BaseModel):
    memory_score: Optional[float] = None
    memory_accuracy: Optional[float] = None
    memory_correct: Optional[int] = None
    memory_total: Optional[int] = None
    
    attention_score: Optional[float] = None
    attention_accuracy: Optional[float] = None
    attention_hits: Optional[int] = None
    attention_false_alarms: Optional[int] = None
    
    reaction_score: Optional[float] = None
    reaction_avg_time: Optional[float] = None
    reaction_best_time: Optional[float] = None
    
    speech_duration: Optional[float] = None
    speech_data: Optional[str] = None
    speech_analysis: Optional[dict] = None


class Assessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    test_date: datetime = Field(default_factory=datetime.utcnow)
    results: AssessmentResult
    overall_score: float
    risk_level: str  # Low, Moderate, High
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class AssessmentCreate(BaseModel):
    results: AssessmentResult


class AssessmentResponse(BaseModel):
    id: str
    user_id: str
    test_date: datetime
    results: AssessmentResult
    overall_score: float
    risk_level: str
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class AssessmentHistory(BaseModel):
    assessments: List[AssessmentResponse]
    total_count: int


class ShareLink(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    token: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    accessed_count: int = 0
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

