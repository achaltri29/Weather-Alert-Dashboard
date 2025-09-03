# Smart Weather & Alert Dashboard

A modern, responsive weather dashboard with real-time alerts, 5-day forecast, and interactive weather map. Features dark/light mode, comprehensive error handling, PWA support, and advanced features like city comparison and favorites.

## ✨ Features

### 🌤️ Core Weather Features
- **Real-time Weather Data** - Current conditions and detailed weather information
- **5-Day Forecast** - Horizontal scrollable forecast cards
- **Smart Weather Alerts** - Color-coded alerts for severe weather conditions
- **Interactive Weather Map** - Resizable OpenWeatherMap integration with city centering

### 🎨 UI/UX Features
- **Dark/Light Mode** - Toggle with localStorage persistence
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Spinner during data fetch
- **Error Handling** - Network errors, city not found, rate limiting
- **Beautiful UI** - Modern design with gradients, shadows, and smooth animations

### 🚀 Advanced Features
- **Recent Cities** - Last 5 searched cities stored in localStorage
- **City Comparison** - Compare weather between two cities side by side
- **Favorite Cities** - Star icon to save and auto-load favorite city
- **PDF Export** - Export current weather data to downloadable report
- **PWA Support** - Installable app with offline functionality

### 🔔 Smart Alerts
- **Rain Alert** (Blue): If rain in forecast → "Carry umbrella 🌧"
- **Heat Warning** (Red): If temp > 35°C → "Stay hydrated 🥵"
- **High Winds Warning** (Yellow): If wind > 50 km/h → "High winds warning 🌪"

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **CORS** enabled for cross-origin requests
- **Axios** for HTTP requests to OpenWeatherMap API
- **Comprehensive error handling** for all API scenarios
- **Docker support** for easy deployment

### Frontend
- **Vanilla JavaScript** (ES6+)
- **Modern CSS** with CSS Grid and Flexbox
- **Font Awesome** icons
- **Google Fonts** (Inter)
- **PWA** with service worker and manifest
- **Responsive design** with mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd weatheralertdashboard
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Edit .env file and add your API key
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   open index.html
   ```

### Docker Setup

```bash
# Set your API key
export OPENWEATHER_API_KEY=your_actual_api_key_here

# Start with Docker Compose
docker-compose up -d
```

## 🌍 Deployment

### Backend Deployment on Render

**Step 1: Prepare Your Repository**
- Ensure your code is pushed to GitHub
- Make sure `render.yaml` is in your repository root
- Verify `backend/server.js` has the root route `/`

**Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

**Step 3: Create New Web Service**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Render will auto-detect the configuration from `render.yaml`
4. Verify the settings:
   - **Name**: `weather-alert-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `backend`

**Step 4: Add Environment Variables**
1. In the Render dashboard, go to your service
2. Click "Environment" tab
3. Add the following environment variable:
   ```
   OPENWEATHER_API_KEY = your_actual_openweather_api_key_here
   ```
4. Click "Save Changes"

**Step 5: Deploy**
1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait for the build to complete
3. Your backend will be available at: `https://weather-alert-dashboard.onrender.com`

**Step 6: Test Your Backend Deployment**
- Health check: `https://weather-alert-dashboard.onrender.com/api/health`
- Root endpoint: `https://weather-alert-dashboard.onrender.com/`
- Weather endpoint: `https://weather-alert-dashboard.onrender.com/api/weather/london`

### Frontend Deployment on Netlify

**Step 1: Prepare Your Repository**
- Ensure your code is pushed to GitHub
- Make sure `netlify.toml` is in your repository root
- Verify `frontend/app.js` has automatic API URL detection

**Step 2: Create Netlify Account**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

**Step 3: Create New Site**
1. Click "New site from Git"
2. Choose "GitHub" as your Git provider
3. Select your repository
4. Configure build settings:
   - **Build command**: Leave empty (no build needed)
   - **Publish directory**: `frontend`
   - **Base directory**: Leave empty

**Step 4: Deploy**
1. Click "Deploy site"
2. Wait for the deployment to complete
3. Your frontend will be available at: `https://eloquent-cuchufli-dbfc4f.netlify.app`

**Step 5: Test Your Frontend Deployment**
1. Open your Netlify site URL
2. Open browser developer tools (F12)
3. Check the console for server health check logs
4. Try searching for a city to verify API connectivity

## 🧪 Testing and Verification

### Backend Testing

**1. Test Backend Health Check:**
```bash
# Visit your backend health endpoint
curl https://weather-alert-dashboard.onrender.com/api/health

# Expected response:
{
  "success": true,
  "message": "Weather Alert Dashboard API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "port": 3001,
  "apiKeyConfigured": true,
  "features": {
    "weather": true,
    "alerts": true,
    "email": false,
    "database": true
  }
}
```

**2. Test Weather Endpoint:**
```bash
# Test weather API
curl https://weather-alert-dashboard.onrender.com/api/weather/london

# Expected response:
{
  "success": true,
  "data": {
    "current": { ... },
    "forecast": [ ... ]
  }
}
```

**3. Test Root Endpoint:**
```bash
# Test root endpoint
curl https://weather-alert-dashboard.onrender.com/

# Expected response:
{
  "message": "Backend running",
  "service": "Smart Weather & Alert Dashboard API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "port": 3001,
  "apiKeyConfigured": true
}
```

### Frontend Testing

**1. Open Browser Console:**
- Open your Netlify site URL
- Press F12 to open developer tools
- Go to the "Console" tab

**2. Check Server Health:**
```javascript
// In browser console, you should see:
// "Checking server health at: https://weather-alert-dashboard.onrender.com/api"
// "Server is healthy: {success: true, ...}"
```

**3. Test API Calls:**
```javascript
// Test health check from frontend
fetch('https://weather-alert-dashboard.onrender.com/api/health')
  .then(response => response.json())
  .then(data => console.log('Backend health:', data))
  .catch(error => console.error('Backend error:', error));

// Test weather data fetch
fetch('https://weather-alert-dashboard.onrender.com/api/weather/london')
  .then(response => response.json())
  .then(data => console.log('Weather data:', data))
  .catch(error => console.error('Weather error:', error));
```

**4. Test Weather Search:**
- Search for a city (e.g., "London")
- Verify weather data loads correctly
- Check that all UI elements update properly

### End-to-End Testing Checklist

- [ ] Backend deploys successfully on Render
- [ ] Frontend deploys successfully on Netlify
- [ ] Health check endpoint returns success
- [ ] Root endpoint returns "Backend running"
- [ ] Weather endpoint returns valid data
- [ ] Frontend console shows successful health check
- [ ] Weather search functionality works
- [ ] All UI features work (alerts, forecast, map)
- [ ] PWA features work (install prompt, offline)
- [ ] Dark/light mode toggle works
- [ ] Recent cities and favorites work
- [ ] City comparison works
- [ ] PDF export works

## 🔧 API Endpoints

### Backend API
- `GET /` - Root endpoint (returns "Backend running")
- `GET /api/health` - Health check endpoint
- `GET /api/weather/:city` - Get weather data for a specific city
- `POST /api/subscribe` - Subscribe to weather alerts
- `GET /api/subscribers` - Get all subscribers (admin)

### Error Handling
The API returns structured error responses:

```json
{
  "success": false,
  "error": "City not found",
  "type": "city_not_found",
  "message": "Please check the city name and try again"
}
```

## 📁 Project Structure

```
weatheralertdashboard/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── alerts.js          # Alert service with email/database
│   ├── alerts-cron.js     # Automated alert checking
│   ├── package.json       # Backend dependencies
│   ├── Dockerfile         # Docker configuration
│   ├── .env              # Environment variables
│   └── .gitignore        # Git ignore file
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── style.css         # CSS with dark/light theme
│   ├── app.js           # JavaScript application logic
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── icons/          # PWA icons
├── render.yaml          # Render deployment configuration
├── netlify.toml         # Netlify deployment configuration
├── docker-compose.yml   # Full stack Docker setup
├── DEPLOYMENT.md       # Comprehensive deployment guide
└── README.md          # This file
```

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Testing Your Backend
```bash
# Test root endpoint
curl http://localhost:3001/

# Test health check
curl http://localhost:3001/api/health

# Test weather endpoint
curl http://localhost:3001/api/weather/london
```

### Testing Your Frontend
```bash
# Open frontend locally
cd frontend
open index.html

# Check browser console for API connectivity logs
```

### Adding New Features
1. Backend changes go in `backend/server.js`
2. Frontend changes go in `frontend/app.js` and `frontend/style.css`
3. Update this README for new features

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Backend now allows all origins with `origin: true`
   - Check that backend is running and accessible

2. **API Key Issues:**
   - Verify OpenWeatherMap API key is correct
   - Check environment variables in Render dashboard
   - Backend now shows `apiKeyConfigured: true/false` in health check

3. **Render Deployment Issues:**
   - Check build logs in Render dashboard
   - Verify `render.yaml` configuration
   - Ensure all dependencies are in `package.json`

4. **Netlify Deployment Issues:**
   - Check build logs in Netlify dashboard
   - Verify `netlify.toml` configuration
   - Ensure `frontend/` directory exists

5. **Frontend Connection Issues:**
   - Check browser console for error messages
   - Verify backend URL in `frontend/app.js`
   - Test backend endpoints directly

6. **PWA Issues:**
   - Ensure HTTPS in production
   - Check manifest.json accessibility

### Health Checks
```bash
# Local backend
curl http://localhost:3001/api/health

# Render backend (replace with your URL)
curl https://weather-alert-dashboard.onrender.com/api/health

# Netlify frontend (replace with your URL)
curl https://eloquent-cuchufli-dbfc4f.netlify.app
```

## 📊 Performance

### Optimizations
- Service worker caching
- Lazy loading of resources
- Optimized images and icons
- Minimal dependencies
- Efficient API calls

### Monitoring
- Built-in health checks
- Error logging
- Performance metrics
- User analytics ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test on multiple devices

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Hosting by [Render](https://render.com/) and [Netlify](https://netlify.com/)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review deployment logs in Render/Netlify dashboards
3. Test locally first
4. Create an issue in the repository

---

**Made with ❤️ for weather enthusiasts everywhere!**

## 🔗 Your Deployment URLs

After deployment, your services will be available at:

**Backend (Render):**
```
RENDER_BACKEND_URL=https://weather-alert-dashboard.onrender.com
```

**Frontend (Netlify):**
```
NETLIFY_FRONTEND_URL=https://eloquent-cuchufli-dbfc4f.netlify.app
```

The frontend automatically detects the environment and uses the correct API URL!

## 🌐 Live Demo

### Backend API (Render)
**Health Check:** https://weather-alert-dashboard.onrender.com/api/health
**Weather Endpoint:** https://weather-alert-dashboard.onrender.com/api/weather/london
**Root Endpoint:** https://weather-alert-dashboard.onrender.com/

### Frontend App (Netlify)
**Live Application:** https://eloquent-cuchufli-dbfc4f.netlify.app

### Testing the Live Demo

1. **Test Backend Health:**
   ```bash
   curl https://weather-alert-dashboard.onrender.com/api/health
   ```

2. **Test Weather API:**
   ```bash
   curl https://weather-alert-dashboard.onrender.com/api/weather/london
   ```

3. **Test Frontend:**
   - Visit the Netlify URL
   - Open browser console (F12)
   - Search for a city to verify API connectivity

### Deployment Status
- ✅ Backend deployed on Render
- ✅ Frontend deployed on Netlify
- ✅ CORS configured for cross-origin requests
- ✅ API key validation implemented
- ✅ Error handling and logging enabled
- ✅ PWA features enabled
- ✅ Responsive design tested

