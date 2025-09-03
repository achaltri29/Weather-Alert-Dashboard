# 🚀 Complete Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available)
- Netlify account (free tier available)
- OpenWeatherMap API key (free at openweathermap.org)

## Step 1: Set up GitHub Repository

1. **Create new repository on GitHub:**
   - Go to github.com and create a new repository
   - Name: `weatheralertdashboard`
   - Don't initialize with README

2. **Add remote and push code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/weatheralertdashboard.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend on Render

1. **Go to render.com and sign in with GitHub**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure service:**
   - Name: `weather-alert-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `backend`
5. **Add Environment Variables:**
   - `OPENWEATHER_API_KEY`: Your actual API key
   - `NODE_ENV`: `production`
6. **Click "Create Web Service"**
7. **Wait for deployment (5-10 minutes)**

## Step 3: Deploy Frontend on Netlify

1. **Go to netlify.com and sign in with GitHub**
2. **Click "New site from Git"**
3. **Choose GitHub and select your repository**
4. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `frontend`
   - Base directory: (leave empty)
5. **Click "Deploy site"**
6. **Wait for deployment (2-3 minutes)**

## Step 4: Verify Deployment

1. **Run the verification script:**
   ```bash
   ./verify-deployment.sh
   ```

2. **Manual testing:**
   - Test backend: `https://your-backend.onrender.com/api/health`
   - Test frontend: Visit your Netlify URL
   - Search for a city and verify functionality

## Step 5: Update README

Update the Live Demo section in README.md with your actual URLs:

```markdown
## 🌐 Live Demo

### Backend API (Render)
**Health Check:** https://your-backend.onrender.com/api/health
**Weather Endpoint:** https://your-backend.onrender.com/api/weather/london
**Root Endpoint:** https://your-backend.onrender.com/

### Frontend App (Netlify)
**Live Application:** https://your-site.netlify.app
```

## Troubleshooting

### Backend Issues
- Check Render build logs
- Verify API key is set correctly
- Test endpoints manually with curl

### Frontend Issues
- Check Netlify build logs
- Verify CORS is working (check browser console)
- Test API connectivity

### CORS Issues
- Backend is configured with `origin: true` to allow all origins
- Check browser console for CORS errors
- Verify backend is accessible from frontend domain

## Expected Results

✅ Backend health check returns: `{"status": "ok", "apiKeyConfigured": true}`
✅ Frontend loads without errors
✅ Weather search works
✅ No CORS errors in browser console
✅ All features work (alerts, forecast, map, PWA)

