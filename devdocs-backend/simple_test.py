"""
DevDocs API - Simple Test Script
Tests all endpoints and reports results
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"

print("=" * 70)
print("🧪 DEVDOCS API TEST SUITE")
print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 70)

passed = 0
failed = 0
created_solution_id = None

def test_endpoint(name, method, url, data=None, expected_status=200):
    """Test a single endpoint"""
    global passed, failed, created_solution_id
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, timeout=10)
        
        success = response.status_code == expected_status
        
        if success:
            passed += 1
            print(f"✅ PASS - {name}")
            print(f"   Status: {response.status_code}")
            
            # Store created solution ID for later tests
            if method == "POST" and "solutions" in url and response.status_code == 201:
                created_solution_id = response.json().get("id")
                print(f"   Created ID: {created_solution_id}")
            
            # Show result summary for some endpoints
            if method == "GET" and response.status_code == 200:
                try:
                    data = response.json()
                    if "total" in data:
                        print(f"   Total: {data['total']}")
                    elif "total_solutions" in data:
                        print(f"   Solutions: {data['total_solutions']}, Languages: {data['total_languages']}")
                    elif "total_results" in data:
                        print(f"   Results: {data['total_results']}, Time: {data['search_time_ms']}ms")
                except:
                    pass
        else:
            failed += 1
            print(f"❌ FAIL - {name}")
            print(f"   Expected: {expected_status}, Got: {response.status_code}")
            try:
                print(f"   Error: {response.json()}")
            except:
                print(f"   Error: {response.text[:200]}")
        
        print()
        return created_solution_id
        
    except Exception as e:
        failed += 1
        print(f"❌ FAIL - {name}")
        print(f"   Exception: {str(e)}")
        print()
        return None


# ============================================================================
# HEALTH TESTS
# ============================================================================
print("\n🏥 HEALTH ENDPOINTS")
print("-" * 70)

test_endpoint("Root endpoint", "GET", f"{BASE_URL}/")
test_endpoint("Health check", "GET", f"{API_URL}/health")


# ============================================================================
# SOLUTIONS CRUD TESTS
# ============================================================================
print("\n📝 SOLUTIONS CRUD")
print("-" * 70)

# Create solution
created_solution_id = test_endpoint(
    "Create solution",
    "POST",
    f"{API_URL}/solutions",
    {
        "title": "Test API Solution - Python List Comprehension",
        "description": "This test solution demonstrates list comprehension in Python with filtering and transformation",
        "code": "numbers = [1, 2, 3, 4, 5]\nevens = [x*2 for x in numbers if x % 2 == 0]\nprint(evens)",
        "language": "python",
        "tags": ["python", "list-comprehension", "test"]
    },
    201
)

# List solutions
test_endpoint("List all solutions", "GET", f"{API_URL}/solutions")
test_endpoint("List with pagination", "GET", f"{API_URL}/solutions?page=1&page_size=3")
test_endpoint("Filter by language", "GET", f"{API_URL}/solutions?language=python")

# Get single solution (use first from database)
test_endpoint("Get single solution (sample)", "GET", f"{API_URL}/solutions?page=1&page_size=1")

# Update solution (if we created one)
if created_solution_id:
    test_endpoint(
        "Update solution",
        "PUT",
        f"{API_URL}/solutions/{created_solution_id}",
        {"title": "Updated Test Solution - Python List Comprehension"}
    )
    
    # Delete solution
    test_endpoint(
        "Delete solution (archive)",
        "DELETE",
        f"{API_URL}/solutions/{created_solution_id}",
        expected_status=204
    )

# Test validation errors
test_endpoint(
    "Create solution (invalid - title too short)",
    "POST",
    f"{API_URL}/solutions",
    {
        "title": "abc",
        "description": "Valid description that meets length requirements",
        "code": "print('test')",
        "language": "python",
        "tags": ["test"]
    },
    422
)


# ============================================================================
# SEARCH TESTS
# ============================================================================
print("\n🔍 SEARCH")
print("-" * 70)

test_endpoint(
    "Semantic search",
    "POST",
    f"{API_URL}/search",
    {"query": "how to fix CORS error", "limit": 5}
)

test_endpoint(
    "Search suggestions",
    "GET",
    f"{API_URL}/search/suggestions?query=python&limit=5"
)


# ============================================================================
# DASHBOARD TESTS
# ============================================================================
print("\n📊 DASHBOARD")
print("-" * 70)

test_endpoint("Dashboard stats", "GET", f"{API_URL}/dashboard/stats")
test_endpoint("Recent solutions", "GET", f"{API_URL}/dashboard/recent?limit=5")
test_endpoint("Popular tags", "GET", f"{API_URL}/dashboard/popular-tags?limit=10")


# ============================================================================
# SUMMARY
# ============================================================================
total = passed + failed
success_rate = (passed / total * 100) if total > 0 else 0

print("\n" + "=" * 70)
print("📊 TEST SUMMARY")
print("=" * 70)
print(f"Total Tests: {total}")
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print(f"Success Rate: {success_rate:.1f}%")
print("=" * 70)

if failed == 0:
    print("\n🎉 All tests passed! API is working correctly.")
else:
    print(f"\n⚠️  {failed} test(s) failed. Check errors above.")
