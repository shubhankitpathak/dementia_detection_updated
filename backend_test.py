#!/usr/bin/env python3
"""
Backend API Testing for AI-Powered Early Dementia Detection Platform
Tests all authentication and assessment endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://error-hunter-30.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.user_data = None
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        print("\n=== Testing User Registration ===")
        
        # Test successful registration
        registration_data = {
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User",
            "preferred_language": "en"
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_data = data["user"]
                    self.log_result(
                        "User Registration - Success",
                        True,
                        "Successfully registered user and received JWT token"
                    )
                else:
                    self.log_result(
                        "User Registration - Success",
                        False,
                        "Registration succeeded but missing required fields",
                        f"Response: {data}"
                    )
            else:
                self.log_result(
                    "User Registration - Success",
                    False,
                    f"Registration failed with status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "User Registration - Success",
                False,
                "Registration request failed",
                str(e)
            )
        
        # Test duplicate email registration
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                self.log_result(
                    "User Registration - Duplicate Email",
                    True,
                    "Correctly rejected duplicate email registration"
                )
            else:
                self.log_result(
                    "User Registration - Duplicate Email",
                    False,
                    f"Should have rejected duplicate email but got status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "User Registration - Duplicate Email",
                False,
                "Duplicate email test failed",
                str(e)
            )
    
    def test_user_login(self):
        """Test user login endpoint"""
        print("\n=== Testing User Login ===")
        
        # Test successful login
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_data = data["user"]
                    self.log_result(
                        "User Login - Success",
                        True,
                        "Successfully logged in and received JWT token"
                    )
                else:
                    self.log_result(
                        "User Login - Success",
                        False,
                        "Login succeeded but missing required fields",
                        f"Response: {data}"
                    )
            else:
                self.log_result(
                    "User Login - Success",
                    False,
                    f"Login failed with status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "User Login - Success",
                False,
                "Login request failed",
                str(e)
            )
        
        # Test invalid credentials
        invalid_login_data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/login",
                json=invalid_login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                self.log_result(
                    "User Login - Invalid Credentials",
                    True,
                    "Correctly rejected invalid credentials"
                )
            else:
                self.log_result(
                    "User Login - Invalid Credentials",
                    False,
                    f"Should have rejected invalid credentials but got status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "User Login - Invalid Credentials",
                False,
                "Invalid credentials test failed",
                str(e)
            )
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        print("\n=== Testing Get Current User ===")
        
        # Test with valid token
        if self.access_token:
            try:
                response = self.session.get(
                    f"{BACKEND_URL}/auth/me",
                    headers={"Authorization": f"Bearer {self.access_token}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "id" in data and "email" in data and "name" in data:
                        self.log_result(
                            "Get Current User - Valid Token",
                            True,
                            "Successfully retrieved user information"
                        )
                    else:
                        self.log_result(
                            "Get Current User - Valid Token",
                            False,
                            "Response missing required user fields",
                            f"Response: {data}"
                        )
                else:
                    self.log_result(
                        "Get Current User - Valid Token",
                        False,
                        f"Failed to get user info with status {response.status_code}",
                        f"Response: {response.text}"
                    )
            except Exception as e:
                self.log_result(
                    "Get Current User - Valid Token",
                    False,
                    "Get current user request failed",
                    str(e)
                )
        else:
            self.log_result(
                "Get Current User - Valid Token",
                False,
                "No access token available for testing"
            )
        
        # Test without token
        try:
            response = self.session.get(f"{BACKEND_URL}/auth/me")
            
            if response.status_code == 401:
                self.log_result(
                    "Get Current User - No Token",
                    True,
                    "Correctly rejected request without token"
                )
            else:
                self.log_result(
                    "Get Current User - No Token",
                    False,
                    f"Should have rejected request without token but got status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "Get Current User - No Token",
                False,
                "No token test failed",
                str(e)
            )
        
        # Test with invalid token
        try:
            response = self.session.get(
                f"{BACKEND_URL}/auth/me",
                headers={"Authorization": "Bearer invalid_token_here"}
            )
            
            if response.status_code == 401:
                self.log_result(
                    "Get Current User - Invalid Token",
                    True,
                    "Correctly rejected invalid token"
                )
            else:
                self.log_result(
                    "Get Current User - Invalid Token",
                    False,
                    f"Should have rejected invalid token but got status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "Get Current User - Invalid Token",
                False,
                "Invalid token test failed",
                str(e)
            )
    
    def test_save_assessment(self):
        """Test save assessment endpoint"""
        print("\n=== Testing Save Assessment ===")
        
        if not self.access_token:
            self.log_result(
                "Save Assessment",
                False,
                "No access token available for testing"
            )
            return
        
        assessment_data = {
            "results": {
                "memory_accuracy": 85.5,
                "memory_correct": 5,
                "memory_total": 6,
                "attention_accuracy": 90.0,
                "attention_hits": 18,
                "attention_false_alarms": 2,
                "reaction_avg_time": 450.5,
                "reaction_best_time": 320.2
            }
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/assessments/save",
                json=assessment_data,
                headers={
                    "Authorization": f"Bearer {self.access_token}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if "overall_score" in data and "risk_level" in data:
                    # Verify score calculation
                    expected_score = (85.5 + 90.0) / 2  # Should be 87.75
                    actual_score = data["overall_score"]
                    
                    if abs(actual_score - expected_score) < 0.1:
                        self.log_result(
                            "Save Assessment - Score Calculation",
                            True,
                            f"Correctly calculated overall score: {actual_score}"
                        )
                    else:
                        self.log_result(
                            "Save Assessment - Score Calculation",
                            False,
                            f"Incorrect score calculation. Expected: {expected_score}, Got: {actual_score}"
                        )
                    
                    # Verify risk level
                    expected_risk = "Low"  # Score 87.75 should be Low risk
                    actual_risk = data["risk_level"]
                    
                    if actual_risk == expected_risk:
                        self.log_result(
                            "Save Assessment - Risk Level",
                            True,
                            f"Correctly determined risk level: {actual_risk}"
                        )
                    else:
                        self.log_result(
                            "Save Assessment - Risk Level",
                            False,
                            f"Incorrect risk level. Expected: {expected_risk}, Got: {actual_risk}"
                        )
                else:
                    self.log_result(
                        "Save Assessment",
                        False,
                        "Assessment saved but missing required fields",
                        f"Response: {data}"
                    )
            else:
                self.log_result(
                    "Save Assessment",
                    False,
                    f"Failed to save assessment with status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "Save Assessment",
                False,
                "Save assessment request failed",
                str(e)
            )
    
    def test_get_assessment_history(self):
        """Test get assessment history endpoint"""
        print("\n=== Testing Get Assessment History ===")
        
        if not self.access_token:
            self.log_result(
                "Get Assessment History",
                False,
                "No access token available for testing"
            )
            return
        
        try:
            response = self.session.get(
                f"{BACKEND_URL}/assessments/history",
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "assessments" in data and "total_count" in data:
                    assessments = data["assessments"]
                    total_count = data["total_count"]
                    
                    if len(assessments) > 0:
                        self.log_result(
                            "Get Assessment History",
                            True,
                            f"Successfully retrieved {len(assessments)} assessments (total: {total_count})"
                        )
                    else:
                        self.log_result(
                            "Get Assessment History",
                            True,
                            "Successfully retrieved empty assessment history"
                        )
                else:
                    self.log_result(
                        "Get Assessment History",
                        False,
                        "History response missing required fields",
                        f"Response: {data}"
                    )
            else:
                self.log_result(
                    "Get Assessment History",
                    False,
                    f"Failed to get assessment history with status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "Get Assessment History",
                False,
                "Get assessment history request failed",
                str(e)
            )
        
        # Test pagination
        try:
            response = self.session.get(
                f"{BACKEND_URL}/assessments/history?limit=5&skip=0",
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            
            if response.status_code == 200:
                self.log_result(
                    "Get Assessment History - Pagination",
                    True,
                    "Successfully tested pagination parameters"
                )
            else:
                self.log_result(
                    "Get Assessment History - Pagination",
                    False,
                    f"Pagination test failed with status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "Get Assessment History - Pagination",
                False,
                "Pagination test failed",
                str(e)
            )
    
    def test_get_latest_assessment(self):
        """Test get latest assessment endpoint"""
        print("\n=== Testing Get Latest Assessment ===")
        
        if not self.access_token:
            self.log_result(
                "Get Latest Assessment",
                False,
                "No access token available for testing"
            )
            return
        
        try:
            response = self.session.get(
                f"{BACKEND_URL}/assessments/latest",
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "overall_score" in data and "risk_level" in data:
                    self.log_result(
                        "Get Latest Assessment",
                        True,
                        "Successfully retrieved latest assessment"
                    )
                else:
                    self.log_result(
                        "Get Latest Assessment",
                        False,
                        "Latest assessment response missing required fields",
                        f"Response: {data}"
                    )
            elif response.status_code == 404:
                self.log_result(
                    "Get Latest Assessment",
                    True,
                    "No assessments found (404) - this is expected for new users"
                )
            else:
                self.log_result(
                    "Get Latest Assessment",
                    False,
                    f"Failed to get latest assessment with status {response.status_code}",
                    f"Response: {response.text}"
                )
        except Exception as e:
            self.log_result(
                "Get Latest Assessment",
                False,
                "Get latest assessment request failed",
                str(e)
            )
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for AI-Powered Early Dementia Detection Platform")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 80)
        
        # Run tests in order
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()
        self.test_save_assessment()
        self.test_get_assessment_history()
        self.test_get_latest_assessment()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)