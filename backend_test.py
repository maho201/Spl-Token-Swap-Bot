#!/usr/bin/env python3
"""
AdaCapitalMarket Backend Authentication System Tests
Tests all authentication endpoints and protected routes
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BASE_URL = "https://7d62317d-a2d3-4584-abcf-77d94d1db4b8.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_user_email = "john.doe@adacapital.com"
        self.test_user_password = "SecurePass123!"
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_user_registration(self):
        """Test user registration endpoint"""
        print("=== Testing User Registration ===")
        
        # Test 1: Valid registration
        registration_data = {
            "email": self.test_user_email,
            "first_name": "John",
            "last_name": "Doe",
            "password": self.test_user_password,
            "confirm_password": self.test_user_password,
            "phone": "+1234567890",
            "country": "USA"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/auth/register", json=registration_data)
            if response.status_code == 201 or response.status_code == 200:
                data = response.json()
                if "user_id" in data and "message" in data:
                    self.log_test("User Registration - Valid Data", True, f"User created with ID: {data.get('user_id')}")
                else:
                    self.log_test("User Registration - Valid Data", False, f"Missing user_id or message in response: {data}")
            else:
                self.log_test("User Registration - Valid Data", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("User Registration - Valid Data", False, f"Exception: {str(e)}")

        # Test 2: Mismatched passwords
        invalid_data = registration_data.copy()
        invalid_data["confirm_password"] = "DifferentPassword123!"
        
        try:
            response = self.session.post(f"{self.base_url}/auth/register", json=invalid_data)
            if response.status_code == 400:
                data = response.json()
                if "Passwords do not match" in data.get("detail", ""):
                    self.log_test("User Registration - Mismatched Passwords", True, "Correctly rejected mismatched passwords")
                else:
                    self.log_test("User Registration - Mismatched Passwords", False, f"Wrong error message: {data}")
            else:
                self.log_test("User Registration - Mismatched Passwords", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("User Registration - Mismatched Passwords", False, f"Exception: {str(e)}")

        # Test 3: Duplicate email
        try:
            response = self.session.post(f"{self.base_url}/auth/register", json=registration_data)
            if response.status_code == 400:
                data = response.json()
                if "Email already registered" in data.get("detail", ""):
                    self.log_test("User Registration - Duplicate Email", True, "Correctly rejected duplicate email")
                else:
                    self.log_test("User Registration - Duplicate Email", False, f"Wrong error message: {data}")
            else:
                self.log_test("User Registration - Duplicate Email", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("User Registration - Duplicate Email", False, f"Exception: {str(e)}")

    def test_user_login(self):
        """Test user login endpoint"""
        print("=== Testing User Login ===")
        
        # Test 1: Valid login
        login_data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        try:
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.auth_token = data["access_token"]
                    self.log_test("User Login - Valid Credentials", True, f"Token received: {data['token_type']} {data['access_token'][:20]}...")
                else:
                    self.log_test("User Login - Valid Credentials", False, f"Missing token in response: {data}")
            else:
                self.log_test("User Login - Valid Credentials", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("User Login - Valid Credentials", False, f"Exception: {str(e)}")

        # Test 2: Invalid credentials
        invalid_login = {
            "email": self.test_user_email,
            "password": "WrongPassword123!"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/auth/login", json=invalid_login)
            if response.status_code == 401:
                data = response.json()
                if "Incorrect email or password" in data.get("detail", ""):
                    self.log_test("User Login - Invalid Credentials", True, "Correctly rejected invalid credentials")
                else:
                    self.log_test("User Login - Invalid Credentials", False, f"Wrong error message: {data}")
            else:
                self.log_test("User Login - Invalid Credentials", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("User Login - Invalid Credentials", False, f"Exception: {str(e)}")

    def test_protected_routes(self):
        """Test protected routes with and without authentication"""
        print("=== Testing Protected Routes ===")
        
        if not self.auth_token:
            self.log_test("Protected Routes Setup", False, "No auth token available for testing")
            return

        headers = {"Authorization": f"Bearer {self.auth_token}"}

        # Test 1: GET /api/auth/me with valid token
        try:
            response = self.session.get(f"{self.base_url}/auth/me", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if "email" in data and data["email"] == self.test_user_email:
                    self.log_test("Protected Route - /auth/me with token", True, f"User data retrieved: {data['email']}")
                else:
                    self.log_test("Protected Route - /auth/me with token", False, f"Unexpected user data: {data}")
            else:
                self.log_test("Protected Route - /auth/me with token", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Protected Route - /auth/me with token", False, f"Exception: {str(e)}")

        # Test 2: GET /api/dashboard/summary with valid token
        try:
            response = self.session.get(f"{self.base_url}/dashboard/summary", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if "total_balance" in data and "accounts" in data:
                    self.log_test("Protected Route - /dashboard/summary with token", True, f"Dashboard data retrieved with balance: {data.get('total_balance')}")
                else:
                    self.log_test("Protected Route - /dashboard/summary with token", False, f"Missing expected fields: {data}")
            else:
                self.log_test("Protected Route - /dashboard/summary with token", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Protected Route - /dashboard/summary with token", False, f"Exception: {str(e)}")

        # Test 3: GET /api/accounts with valid token
        try:
            response = self.session.get(f"{self.base_url}/accounts", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    account = data[0]
                    if "account_number" in account and "balance" in account:
                        self.log_test("Protected Route - /accounts with token", True, f"Trading accounts retrieved: {len(data)} accounts")
                    else:
                        self.log_test("Protected Route - /accounts with token", False, f"Invalid account structure: {account}")
                else:
                    self.log_test("Protected Route - /accounts with token", False, f"No accounts returned or invalid format: {data}")
            else:
                self.log_test("Protected Route - /accounts with token", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Protected Route - /accounts with token", False, f"Exception: {str(e)}")

        # Test 4: Access without token (should return 401)
        protected_endpoints = ["/auth/me", "/dashboard/summary", "/accounts"]
        
        for endpoint in protected_endpoints:
            try:
                response = self.session.get(f"{self.base_url}{endpoint}")
                if response.status_code == 401:
                    self.log_test(f"Protected Route - {endpoint} without token", True, "Correctly rejected unauthorized access")
                else:
                    self.log_test(f"Protected Route - {endpoint} without token", False, f"Expected 401, got {response.status_code}")
            except Exception as e:
                self.log_test(f"Protected Route - {endpoint} without token", False, f"Exception: {str(e)}")

    def test_market_data(self):
        """Test market data endpoint (should work without authentication)"""
        print("=== Testing Market Data ===")
        
        try:
            response = self.session.get(f"{self.base_url}/market/prices")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    price = data[0]
                    if "symbol" in price and "bid" in price and "ask" in price:
                        self.log_test("Market Data - /market/prices", True, f"Market data retrieved: {len(data)} symbols")
                    else:
                        self.log_test("Market Data - /market/prices", False, f"Invalid price structure: {price}")
                else:
                    self.log_test("Market Data - /market/prices", False, f"No market data returned: {data}")
            else:
                self.log_test("Market Data - /market/prices", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Market Data - /market/prices", False, f"Exception: {str(e)}")

    def test_database_integration(self):
        """Test database integration by verifying data persistence"""
        print("=== Testing Database Integration ===")
        
        if not self.auth_token:
            self.log_test("Database Integration", False, "No auth token available for testing")
            return

        headers = {"Authorization": f"Bearer {self.auth_token}"}

        # Verify user exists in database
        try:
            response = self.session.get(f"{self.base_url}/auth/me", headers=headers)
            if response.status_code == 200:
                user_data = response.json()
                
                # Verify trading account was created
                accounts_response = self.session.get(f"{self.base_url}/accounts", headers=headers)
                if accounts_response.status_code == 200:
                    accounts = accounts_response.json()
                    if len(accounts) > 0:
                        account = accounts[0]
                        if account.get("account_type") == "standard" and account.get("balance") == 10000.0:
                            self.log_test("Database Integration - User and Account Creation", True, 
                                        f"User {user_data['email']} and default trading account created successfully")
                        else:
                            self.log_test("Database Integration - User and Account Creation", False, 
                                        f"Default account not properly configured: {account}")
                    else:
                        self.log_test("Database Integration - User and Account Creation", False, "No trading accounts found")
                else:
                    self.log_test("Database Integration - User and Account Creation", False, 
                                f"Failed to retrieve accounts: {accounts_response.status_code}")
            else:
                self.log_test("Database Integration - User and Account Creation", False, 
                            f"Failed to retrieve user: {response.status_code}")
        except Exception as e:
            self.log_test("Database Integration - User and Account Creation", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting AdaCapitalMarket Backend Authentication Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        self.test_user_registration()
        self.test_user_login()
        self.test_protected_routes()
        self.test_market_data()
        self.test_database_integration()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["success"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = BackendTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if any tests failed
    sys.exit(0 if failed == 0 else 1)