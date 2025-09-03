#!/bin/bash

# Smart Weather & Alert Dashboard Deployment Verification Script
echo "🔍 Verifying deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test URL
test_url() {
    local url=$1
    local description=$2
    local expected_status=$3
    
    echo -e "${BLUE}Testing: $description${NC}"
    echo "URL: $url"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$url")
    http_code="${response: -3}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ SUCCESS: HTTP $http_code${NC}"
        if [ -f /tmp/response.json ]; then
            echo "Response:"
            cat /tmp/response.json | head -5
            echo ""
        fi
        return 0
    else
        echo -e "${RED}❌ FAILED: Expected HTTP $expected_status, got HTTP $http_code${NC}"
        if [ -f /tmp/response.json ]; then
            echo "Response:"
            cat /tmp/response.json
        fi
        return 1
    fi
}

# Get URLs from user
echo -e "${YELLOW}Please enter your deployment URLs:${NC}"
read -p "Backend URL (e.g., https://weather-alert-backend.onrender.com): " BACKEND_URL
read -p "Frontend URL (e.g., https://your-site.netlify.app): " FRONTEND_URL

echo ""
echo "🧪 Testing Backend Deployment..."

# Test backend endpoints
test_url "$BACKEND_URL/" "Backend Root Endpoint" "200"
test_url "$BACKEND_URL/api/health" "Backend Health Check" "200"
test_url "$BACKEND_URL/api/weather/london" "Weather API (London)" "200"

echo ""
echo "🌐 Testing Frontend Deployment..."

# Test frontend
test_url "$FRONTEND_URL" "Frontend Application" "200"

echo ""
echo "🔧 CORS Testing..."
echo "Testing if frontend can access backend (this requires manual browser testing)"
echo "1. Open $FRONTEND_URL in your browser"
echo "2. Open Developer Tools (F12)"
echo "3. Go to Console tab"
echo "4. Search for a city"
echo "5. Check for CORS errors in console"

echo ""
echo "📋 Deployment Checklist:"
echo "□ Backend health check returns 200"
echo "□ Backend root endpoint returns 200"
echo "□ Weather API returns 200 for valid city"
echo "□ Frontend loads without errors"
echo "□ No CORS errors in browser console"
echo "□ Weather search functionality works"
echo "□ All UI features work (alerts, forecast, map)"

echo ""
echo "🎉 Verification complete!"
echo "Update your README.md with the actual URLs:"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"

