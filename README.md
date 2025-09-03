# Smart Weather & Alert Dashboard

A modern, responsive weather dashboard with real-time alerts, 5-day forecast, and interactive weather map. Features dark/light mode, comprehensive error handling, PWA support, and advanced features like city comparison and favorites.

## Features

### Core Weather Features
- **Real-time Weather Data** - Current conditions and detailed weather information
- **5-Day Forecast** - Horizontal scrollable forecast cards
- **Smart Weather Alerts** - Color-coded alerts for severe weather conditions
- **Interactive Weather Map** - Resizable OpenWeatherMap integration with city centering

### UI/UX Features
- **Dark/Light Mode** - Toggle with localStorage persistence
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Spinner during data fetch
- **Error Handling** - Network errors, city not found, rate limiting
- **Beautiful UI** - Modern design with gradients, shadows, and smooth animations

### Advanced Features
- **Recent Cities** - Last 5 searched cities stored in localStorage
- **City Comparison** - Compare weather between two cities side by side
- **Favorite Cities** - Star icon to save and auto-load favorite city
- **PDF Export** - Export current weather data to downloadable report
- **PWA Support** - Installable app with offline functionality

### Smart Alerts
- **Rain Alert** (Blue): If rain in forecast → "Carry umbrella"
- **Heat Warning** (Red): If temp > 35°C → "Stay hydrated"
- **High Winds Warning** (Yellow): If wind > 50 km/h → "High winds warning"

## Tech Stack

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


### Prerequisites
- Node.js (v14 or higher)
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))



## Deployment


### Backend Deployment on Render

The backend is available at: `https://weather-alert-dashboard.onrender.com`

**Test the Backend Deployment**
- Health check: `https://weather-alert-dashboard.onrender.com/api/health`
- Root endpoint: `https://weather-alert-dashboard.onrender.com/`
- Weather endpoint: `https://weather-alert-dashboard.onrender.com/api/weather/london`


### Frontend Deployment on Netlify

The frontend is available at: `https://eloquent-cuchufli-dbfc4f.netlify.app`



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


## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Hosting by [Render](https://render.com/) and [Netlify](https://netlify.com/)






