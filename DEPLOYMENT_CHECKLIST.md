# 🚀 Deployment Checklist - Smart Weather & Alert Dashboard

## Pre-Deployment Checklist

### Backend (Render)
- [ ] `render.yaml` is in repository root
- [ ] `backend/server.js` has CORS configured (`origin: true`)
- [ ] `backend/server.js` has API key validation
- [ ] `backend/server.js` has root route `/`
- [ ] `backend/package.json` has all dependencies
- [ ] Environment variable `OPENWEATHER_API_KEY` is set in Render dashboard

### Frontend (Netlify)
- [ ] `netlify.toml` is in repository root
- [ ] `frontend/app.js` has automatic API URL detection
- [ ] `frontend/app.js` uses correct Render backend URL
- [ ] All frontend files are in `frontend/` directory
- [ ] PWA files (`manifest.json`, `sw.js`) are present

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy: Fix CORS and API key handling for production"
git push origin main
```

### 2. Backend Deployment (Render)
1. Go to [render.com](https://render.com)
2. Your service should auto-deploy from GitHub
3. Check deployment logs for any errors
4. Verify environment variables are set

### 3. Frontend Deployment (Netlify)
1. Go to [netlify.com](https://netlify.com)
2. Your site should auto-deploy from GitHub
3. Check deployment logs for any errors
4. Verify `netlify.toml` configuration

## Post-Deployment Testing

### Backend Tests
```bash
# Test health endpoint
curl https://weather-alert-backend.onrender.com/api/health

# Expected response:
{
  "success": true,
  "message": "Weather Alert Dashboard API is running",
  "apiKeyConfigured": true,
  ...
}

# Test weather endpoint
curl https://weather-alert-backend.onrender.com/api/weather/london

# Expected response:
{
  "success": true,
  "data": {
    "current": { ... },
    "forecast": [ ... ]
  }
}
```

### Frontend Tests
1. Open your Netlify site URL
2. Open browser console (F12)
3. Check for successful health check logs
4. Search for a city to test weather functionality
5. Verify all UI features work

### Integration Tests
- [ ] Frontend can connect to backend
- [ ] Weather search returns data
- [ ] All UI features work (alerts, forecast, map)
- [ ] PWA features work (install prompt)
- [ ] Dark/light mode toggle works
- [ ] Recent cities and favorites work
- [ ] City comparison works
- [ ] PDF export works

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check that backend CORS allows all origins
2. **API Key Issues**: Verify `OPENWEATHER_API_KEY` is set in Render
3. **Connection Errors**: Check that backend URL is correct in frontend
4. **Build Failures**: Check deployment logs in Render/Netlify dashboards

### Debug Commands
```bash
# Test backend health
curl -v https://weather-alert-backend.onrender.com/api/health

# Test weather API
curl -v https://weather-alert-backend.onrender.com/api/weather/london

# Check frontend
curl -v https://your-site-name.netlify.app
```

## Success Criteria
- [ ] Backend health endpoint returns success
- [ ] Weather API returns valid data
- [ ] Frontend loads without errors
- [ ] Weather search functionality works
- [ ] All UI features are functional
- [ ] No CORS errors in browser console
- [ ] PWA features work correctly

## Final URLs
- **Backend**: https://weather-alert-backend.onrender.com
- **Frontend**: https://your-site-name.netlify.app

Update these URLs in your README.md Live Demo section!
