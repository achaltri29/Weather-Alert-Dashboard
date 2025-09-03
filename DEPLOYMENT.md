# 🚀 Complete Deployment Guide - Smart Weather & Alert Dashboard

This guide provides step-by-step instructions for deploying both the backend and frontend of your Smart Weather & Alert Dashboard.

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))
- [ ] Render account (free at [render.com](https://render.com))
- [ ] Netlify account (free at [netlify.com](https://netlify.com))

## 🎯 Deployment Overview

We'll deploy:
1. **Backend** → Render (Node.js hosting)
2. **Frontend** → Netlify (Static site hosting)

## 🔧 Part 1: Backend Deployment on Render

### Step 1: Prepare Your Repository

1. **Ensure your code is in GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify these files exist in your repository:**
   - `render.yaml` (in root directory)
   - `backend/server.js` (with root route `/`)
   - `backend/package.json` (with all dependencies)

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. **In Render Dashboard:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `weatheralertdashboard` repository

2. **Configure the service:**
   - **Name**: `weather-alert-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install` (auto-detected from render.yaml)
   - **Start Command**: `node server.js` (auto-detected from render.yaml)
   - **Root Directory**: `backend` (auto-detected from render.yaml)

3. **Click "Create Web Service"**

### Step 4: Configure Environment Variables

1. **In your Render service dashboard:**
   - Go to "Environment" tab
   - Add the following environment variable:
     ```
     Key: OPENWEATHER_API_KEY
     Value: your_actual_openweather_api_key_here
     ```
   - Click "Save Changes"

### Step 5: Deploy and Test

1. **Deploy:**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for the build to complete (usually 2-3 minutes)

2. **Test your backend:**
   ```bash
   # Test root endpoint
   curl https://weather-alert-backend.onrender.com/
   
   # Test health check
   curl https://weather-alert-backend.onrender.com/api/health
   
   # Test weather endpoint
   curl https://weather-alert-backend.onrender.com/api/weather/london
   ```

3. **Expected responses:**
   - Root: `{"message":"Backend running",...}`
   - Health: `{"success":true,"message":"Weather Alert Dashboard API is running",...}`
   - Weather: `{"success":true,"data":{...}}`

### Step 6: Note Your Backend URL

Your backend will be available at:
```
RENDER_BACKEND_URL=https://weather-alert-backend.onrender.com
```

## 🌐 Part 2: Frontend Deployment on Netlify

### Step 1: Prepare Your Repository

1. **Ensure your code is in GitHub:**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Verify these files exist:**
   - `netlify.toml` (in root directory)
   - `frontend/index.html`
   - `frontend/app.js` (with automatic API URL detection)

### Step 2: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify to access your repositories

### Step 3: Create New Site

1. **In Netlify Dashboard:**
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select your `weatheralertdashboard` repository

2. **Configure build settings:**
   - **Build command**: Leave empty (no build needed for static site)
   - **Publish directory**: `frontend`
   - **Base directory**: Leave empty

3. **Click "Deploy site"**

### Step 4: Configure Site Settings

1. **In your Netlify site dashboard:**
   - Go to "Site settings" → "Site information"
   - Change site name to something memorable (e.g., `my-weather-dashboard`)
   - Your site will be available at: `https://my-weather-dashboard.netlify.app`

2. **Optional - Custom Domain:**
   - Go to "Domain management"
   - Add your custom domain if you have one

### Step 5: Test Your Frontend

1. **Open your Netlify site URL**
2. **Open browser developer tools (F12)**
3. **Check the console for logs:**
   - Should see: "Checking server health at: https://weather-alert-backend.onrender.com/api"
   - Should see: "Server is healthy: {success: true, ...}"

4. **Test weather functionality:**
   - Search for a city (e.g., "London")
   - Verify weather data loads correctly
   - Check that all features work (alerts, forecast, map)

### Step 6: Note Your Frontend URL

Your frontend will be available at:
```
NETLIFY_FRONTEND_URL=https://your-site-name.netlify.app
```

## ✅ Part 3: Verification and Testing

### Backend Verification

Test all backend endpoints:

```bash
# 1. Root endpoint
curl https://weather-alert-backend.onrender.com/
# Expected: {"message":"Backend running",...}

# 2. Health check
curl https://weather-alert-backend.onrender.com/api/health
# Expected: {"success":true,"message":"Weather Alert Dashboard API is running",...}

# 3. Weather endpoint
curl https://weather-alert-backend.onrender.com/api/weather/london
# Expected: {"success":true,"data":{"current":{...},"forecast":[...]}}
```

### Frontend Verification

Test frontend functionality:

1. **Open your Netlify site**
2. **Check browser console for:**
   - Server health check success
   - No CORS errors
   - No network errors

3. **Test features:**
   - [ ] Search for a city
   - [ ] Weather data displays correctly
   - [ ] 5-day forecast shows
   - [ ] Weather alerts appear (if applicable)
   - [ ] Map loads and centers on city
   - [ ] Dark/light mode toggle works
   - [ ] Recent cities functionality
   - [ ] City comparison works
   - [ ] PDF export works
   - [ ] PWA features (install prompt, offline)

### End-to-End Testing

1. **From your Netlify frontend:**
   ```javascript
   // Test in browser console
   fetch('https://weather-alert-backend.onrender.com/api/health')
     .then(response => response.json())
     .then(data => console.log('Backend health:', data))
     .catch(error => console.error('Backend error:', error));
   ```

2. **Test weather data flow:**
   - Search for "London" in your frontend
   - Verify data loads from your Render backend
   - Check that all UI elements update correctly

## 🔧 Part 4: Configuration Files Reference

### render.yaml
```yaml
services:
  - type: web
    name: weather-alert-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: OPENWEATHER_API_KEY
        sync: false
    healthCheckPath: /api/health
    autoDeploy: true
    branch: main
    rootDir: backend
```

### netlify.toml
```toml
[build]
  publish = "frontend"
  command = "echo 'No build command needed for static site'"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 🚨 Troubleshooting

### Common Backend Issues

1. **Build fails on Render:**
   - Check build logs in Render dashboard
   - Verify all dependencies are in `package.json`
   - Ensure `render.yaml` is in repository root

2. **API key not working:**
   - Verify environment variable is set in Render dashboard
   - Check that the API key is valid at [openweathermap.org](https://openweathermap.org/api)

3. **CORS errors:**
   - Check that your frontend URL is allowed in backend CORS configuration
   - Verify the API URL in frontend matches your Render backend URL

### Common Frontend Issues

1. **Site not deploying on Netlify:**
   - Check build logs in Netlify dashboard
   - Verify `netlify.toml` is in repository root
   - Ensure `frontend/` directory exists

2. **API calls failing:**
   - Check browser console for errors
   - Verify backend is running and accessible
   - Test backend endpoints directly

3. **PWA not working:**
   - Ensure site is served over HTTPS
   - Check that `manifest.json` and `sw.js` are accessible
   - Verify service worker registration in browser console

### Debugging Steps

1. **Check deployment logs:**
   - Render: Go to your service → "Logs" tab
   - Netlify: Go to your site → "Deploys" → Click on deploy → "Deploy log"

2. **Test endpoints directly:**
   ```bash
   # Test backend
   curl -v https://weather-alert-backend.onrender.com/api/health
   
   # Test frontend
   curl -v https://your-site-name.netlify.app
   ```

3. **Check browser console:**
   - Open developer tools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

## 📊 Monitoring and Maintenance

### Render Monitoring

1. **Health checks:**
   - Render automatically monitors your backend
   - Check "Metrics" tab for uptime and performance

2. **Logs:**
   - View real-time logs in "Logs" tab
   - Set up alerts for errors

### Netlify Monitoring

1. **Analytics:**
   - Enable Netlify Analytics in site settings
   - Monitor page views and performance

2. **Forms:**
   - If you add contact forms, they'll be handled automatically

### Updates and Maintenance

1. **Updating your app:**
   ```bash
   # Make changes to your code
   git add .
   git commit -m "Update weather dashboard"
   git push origin main
   
   # Both Render and Netlify will auto-deploy
   ```

2. **Environment variables:**
   - Update in Render dashboard for backend
   - No environment variables needed for frontend

## 🎉 Success!

Once deployed, your Smart Weather & Alert Dashboard will be available at:

- **Backend API**: `https://weather-alert-backend.onrender.com`
- **Frontend App**: `https://your-site-name.netlify.app`

The frontend automatically detects the environment and connects to your deployed backend. Users can search for weather, view forecasts, get alerts, and even install the app on their devices!

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs in Render/Netlify dashboards
3. Test locally first to isolate issues
4. Create an issue in your GitHub repository

---

**Happy Weather Monitoring! 🌤️**
