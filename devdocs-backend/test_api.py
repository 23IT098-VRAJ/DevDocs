"""
DevDocs Backend - Comprehensive API Test Script
Tests all endpoints with edge cases and reports results
"""
import asyncio
import httpx
import json
from typing import Dict, List, Any
from datetime import datetime


# ============================================================================
# Configuration
# ============================================================================
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"


# ============================================================================
# Test Results Tracker
# ============================================================================
class TestRunner:
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0
    
    def log_test(self, name: str, passed: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        self.results.append({
            "name": name,
            "passed": passed,
            "details": details,
            "response": response_data
        })
        if passed:
            self.passed += 1
        else:
            self.failed += 1
        
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        if not passed and response_data:
            print(f"    Response: {json.dumps(response_data, indent=2)}")
        print()
    
    def print_summary(self):
        """Print test summary"""
        total = self.passed + self.failed
        success_rate = (self.passed / total * 100) if total > 0 else 0
        
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {total}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {success_rate:.1f}%")
        print("=" * 70)


# ============================================================================
# Test Functions
# ============================================================================

async def test_health_endpoints(client: httpx.AsyncClient, runner: TestRunner):
    """Test health check endpoints"""
    print("\n" + "=" * 70)
    print("🏥 TESTING HEALTH ENDPOINTS")
    print("=" * 70 + "\n")
    
    # Test root endpoint
    try:
        response = await client.get(f"{BASE_URL}/")
        runner.log_test(
            "GET / (Root endpoint)",
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else None
        )
    except Exception as e:
        runner.log_test("GET / (Root endpoint)", False, f"Error: {str(e)}")
    
    # Test health endpoint
    try:
        response = await client.get(f"{API_URL}/health")
        runner.log_test(
            "GET /api/health",
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else None
        )
    except Exception as e:
        runner.log_test("GET /api/health", False, f"Error: {str(e)}")


async def test_solutions_crud(client: httpx.AsyncClient, runner: TestRunner):
    """Test solutions CRUD endpoints"""
    print("\n" + "=" * 70)
    print("📝 TESTING SOLUTIONS CRUD")
    print("=" * 70 + "\n")
    
    created_solution_id = None
    
    # Test 1: Create solution - Valid data
    try:
        response = await client.post(f"{API_URL}/solutions", json={
            "title": "Test Solution - Python List Comprehension",
            "description": "This is a comprehensive test solution that demonstrates how to use list comprehensions in Python for filtering and transforming data efficiently.",
            "code": "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\neven_squares = [x**2 for x in numbers if x % 2 == 0]\nprint(even_squares)",
            "language": "python",
            "tags": ["python", "list-comprehension", "test"]
        })
        passed = response.status_code == 201
        if passed:
            created_solution_id = response.json().get("id")
        runner.log_test(
            "POST /api/solutions (Valid data)",
            passed,
            f"Status: {response.status_code}",
            response.json() if passed else response.text
        )
    except Exception as e:
        runner.log_test("POST /api/solutions (Valid data)", False, f"Error: {str(e)}")
    
    # Test 2: Create solution - Missing required field
    try:
        response = await client.post(f"{API_URL}/solutions", json={
            "title": "Invalid Solution",
            "description": "Missing code field",
            "language": "python",
            "tags": ["test"]
        })
        runner.log_test(
            "POST /api/solutions (Missing field - should fail)",
            response.status_code == 422,
            f"Status: {response.status_code} (Expected: 422)"
        )
    except Exception as e:
        runner.log_test("POST /api/solutions (Missing field)", False, f"Error: {str(e)}")
    
    # Test 3: Create solution - Title too short
    try:
        response = await client.post(f"{API_URL}/solutions", json={
            "title": "abc",
            "description": "This description is long enough to pass validation requirements",
            "code": "print('hello world')",
            "language": "python",
            "tags": ["test"]
        })
        runner.log_test(
            "POST /api/solutions (Title too short - should fail)",
            response.status_code == 422,
            f"Status: {response.status_code} (Expected: 422)"
        )
    except Exception as e:
        runner.log_test("POST /api/solutions (Title too short)", False, f"Error: {str(e)}")
    
    # Test 4: Get all solutions
    try:
        response = await client.get(f"{API_URL}/solutions")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            total = data.get("total", 0)
            runner.log_test(
                "GET /api/solutions (List all)",
                passed,
                f"Status: {response.status_code}, Total solutions: {total}"
            )
        else:
            runner.log_test(
                "GET /api/solutions (List all)",
                False,
                f"Status: {response.status_code}",
                response.text
            )
    except Exception as e:
        runner.log_test("GET /api/solutions (List all)", False, f"Error: {str(e)}")
    
    # Test 5: Get solutions with pagination
    try:
        response = await client.get(f"{API_URL}/solutions?page=1&page_size=5")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "GET /api/solutions (Pagination)",
                passed,
                f"Page: {data.get('page')}, Size: {len(data.get('solutions', []))}"
            )
        else:
            runner.log_test("GET /api/solutions (Pagination)", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("GET /api/solutions (Pagination)", False, f"Error: {str(e)}")
    
    # Test 6: Filter by language
    try:
        response = await client.get(f"{API_URL}/solutions?language=python")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "GET /api/solutions (Filter by language)",
                passed,
                f"Python solutions: {data.get('total')}"
            )
        else:
            runner.log_test("GET /api/solutions (Filter by language)", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("GET /api/solutions (Filter by language)", False, f"Error: {str(e)}")
    
    # Test 7: Get single solution
    if created_solution_id:
        try:
            response = await client.get(f"{API_URL}/solutions/{created_solution_id}")
            passed = response.status_code == 200
            runner.log_test(
                "GET /api/solutions/{id} (Get single)",
                passed,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            runner.log_test("GET /api/solutions/{id}", False, f"Error: {str(e)}")
    
    # Test 8: Get non-existent solution
    try:
        response = await client.get(f"{API_URL}/solutions/00000000-0000-0000-0000-000000000000")
        runner.log_test(
            "GET /api/solutions/{id} (Non-existent - should 404)",
            response.status_code == 404,
            f"Status: {response.status_code} (Expected: 404)"
        )
    except Exception as e:
        runner.log_test("GET /api/solutions/{id} (Non-existent)", False, f"Error: {str(e)}")
    
    # Test 9: Update solution
    if created_solution_id:
        try:
            response = await client.put(f"{API_URL}/solutions/{created_solution_id}", json={
                "title": "Updated Test Solution - Python List Comprehension"
            })
            passed = response.status_code == 200
            runner.log_test(
                "PUT /api/solutions/{id} (Update)",
                passed,
                f"Status: {response.status_code}"
            )
        except Exception as e:
            runner.log_test("PUT /api/solutions/{id}", False, f"Error: {str(e)}")
    
    # Test 10: Delete solution (archive)
    if created_solution_id:
        try:
            response = await client.delete(f"{API_URL}/solutions/{created_solution_id}")
            runner.log_test(
                "DELETE /api/solutions/{id} (Archive)",
                response.status_code == 204,
                f"Status: {response.status_code} (Expected: 204)"
            )
        except Exception as e:
            runner.log_test("DELETE /api/solutions/{id}", False, f"Error: {str(e)}")


async def test_search_endpoints(client: httpx.AsyncClient, runner: TestRunner):
    """Test search endpoints"""
    print("\n" + "=" * 70)
    print("🔍 TESTING SEARCH ENDPOINTS")
    print("=" * 70 + "\n")
    
    # Test 1: Semantic search - Valid query
    try:
        response = await client.post(f"{API_URL}/search", json={
            "query": "how to fix CORS error in python",
            "limit": 5
        })
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "POST /api/search (Semantic search)",
                passed,
                f"Found {data.get('total_results')} results in {data.get('search_time_ms')}ms"
            )
        else:
            runner.log_test("POST /api/search", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("POST /api/search", False, f"Error: {str(e)}")
    
    # Test 2: Search with empty query
    try:
        response = await client.post(f"{API_URL}/search", json={
            "query": "",
            "limit": 5
        })
        passed = response.status_code == 200  # Should handle empty query gracefully
        runner.log_test(
            "POST /api/search (Empty query)",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        runner.log_test("POST /api/search (Empty query)", False, f"Error: {str(e)}")
    
    # Test 3: Search suggestions
    try:
        response = await client.get(f"{API_URL}/search/suggestions?query=python&limit=5")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "GET /api/search/suggestions",
                passed,
                f"Found {len(data.get('suggestions', []))} suggestions"
            )
        else:
            runner.log_test("GET /api/search/suggestions", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("GET /api/search/suggestions", False, f"Error: {str(e)}")


async def test_dashboard_endpoints(client: httpx.AsyncClient, runner: TestRunner):
    """Test dashboard endpoints"""
    print("\n" + "=" * 70)
    print("📊 TESTING DASHBOARD ENDPOINTS")
    print("=" * 70 + "\n")
    
    # Test 1: Get dashboard stats
    try:
        response = await client.get(f"{API_URL}/dashboard/stats")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "GET /api/dashboard/stats",
                passed,
                f"Total solutions: {data.get('total_solutions')}, Languages: {data.get('total_languages')}, Tags: {data.get('unique_tags')}"
            )
        else:
            runner.log_test("GET /api/dashboard/stats", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("GET /api/dashboard/stats", False, f"Error: {str(e)}")
    
    # Test 2: Get recent solutions
    try:
        response = await client.get(f"{API_URL}/dashboard/recent?limit=5")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "GET /api/dashboard/recent",
                passed,
                f"Found {len(data.get('recent_solutions', []))} recent solutions"
            )
        else:
            runner.log_test("GET /api/dashboard/recent", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("GET /api/dashboard/recent", False, f"Error: {str(e)}")
    
    # Test 3: Get popular tags
    try:
        response = await client.get(f"{API_URL}/dashboard/popular-tags?limit=10")
        passed = response.status_code == 200
        if passed:
            data = response.json()
            runner.log_test(
                "GET /api/dashboard/popular-tags",
                passed,
                f"Found {len(data.get('popular_tags', []))} popular tags"
            )
        else:
            runner.log_test("GET /api/dashboard/popular-tags", False, f"Status: {response.status_code}", response.text)
    except Exception as e:
        runner.log_test("GET /api/dashboard/popular-tags", False, f"Error: {str(e)}")


# ============================================================================
# Main Test Runner
# ============================================================================

async def run_all_tests():
    """Run all API tests"""
    print("\n" + "=" * 70)
    print("🚀 DEVDOCS API TEST SUITE")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    runner = TestRunner()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        await test_health_endpoints(client, runner)
        await test_solutions_crud(client, runner)
        await test_search_endpoints(client, runner)
        await test_dashboard_endpoints(client, runner)
    
    runner.print_summary()
    
    # Return exit code based on results
    return 0 if runner.failed == 0 else 1


if __name__ == "__main__":
    exit_code = asyncio.run(run_all_tests())
    exit(exit_code)
