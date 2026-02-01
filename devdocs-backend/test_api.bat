@echo off
REM DevDocs API Test Script - Simple HTTP Tests
REM Run this after starting the backend server

echo ======================================================================
echo DevDocs API Quick Test
echo ======================================================================
echo.

echo [1/6] Testing Root Endpoint...
curl -s http://localhost:8000/ | python -m json.tool
echo.

echo [2/6] Testing Health Check...
curl -s http://localhost:8000/api/health | python -m json.tool
echo.

echo [3/6] Testing GET Solutions...
curl -s "http://localhost:8000/api/solutions?page=1&page_size=3" | python -m json.tool
echo.

echo [4/6] Testing Dashboard Stats...
curl -s http://localhost:8000/api/dashboard/stats | python -m json.tool
echo.

echo [5/6] Testing Search (Semantic)...
curl -s -X POST http://localhost:8000/api/search -H "Content-Type: application/json" -d "{\"query\": \"how to fix CORS\", \"limit\": 3}" | python -m json.tool
echo.

echo [6/6] Testing Create Solution...
curl -s -X POST http://localhost:8000/api/solutions -H "Content-Type: application/json" -d "{\"title\": \"Quick Test Solution from Script\", \"description\": \"This is a test solution created from the automated test script to verify the API is working correctly\", \"code\": \"print('Hello from test script')\", \"language\": \"python\", \"tags\": [\"test\", \"automation\"]}" | python -m json.tool
echo.

echo ======================================================================
echo Test Complete!
echo ======================================================================
pause
