const express = require('express');
const cors = require('cors');
const axios = require('axios');
const AlertService = require('./alerts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize alert service
const alertService = new AlertService();

// CORS configuration - allow all origins for easier deployment
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Check for required environment variables
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your-api-key-here') {
  console.error('❌ OPENWEATHER_API_KEY is not set or is using default value');
  console.error('Please set OPENWEATHER_API_KEY environment variable');
}

// Root route for Render health check
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running',
    service: 'Smart Weather & Alert Dashboard API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    apiKeyConfigured: !!(OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your-api-key-here')
  });
});

// OpenWeatherMap API configuration
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather endpoint with comprehensive error handling
app.get('/api/weather/:city', async (req, res) => {
  try {
    // Check if API key is configured
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your-api-key-here') {
      return res.status(500).json({
        success: false,
        error: 'API key not configured',
        type: 'configuration_error',
        message: 'OpenWeatherMap API key is not set. Please configure OPENWEATHER_API_KEY environment variable.'
      });
    }

    const { city } = req.params;
    
    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'City name is required',
        type: 'validation_error'
      });
    }

    console.log(`Fetching weather for: ${city}`);

    // Fetch current weather
    const weatherResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 10000 // 10 second timeout
    });

    // Fetch 5-day forecast
    const forecastResponse = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 10000
    });

    // Process forecast data (group by day, take first forecast of each day)
    const forecastData = forecastResponse.data.list.reduce((acc, item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = item;
      }
      return acc;
    }, {});

    const forecast = Object.values(forecastData).slice(0, 5);

    // Process alerts in background
    alertService.processAlerts(weatherResponse.data).catch(console.error);

    res.json({
      success: true,
      data: {
        current: weatherResponse.data,
        forecast: forecast
      }
    });

  } catch (error) {
    console.error('Weather API Error:', error.message);
    
    if (error.response) {
      // API returned an error response
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 404) {
        return res.status(404).json({
          success: false,
          error: 'City not found',
          type: 'city_not_found',
          message: 'Please check the city name and try again'
        });
      } else if (status === 401) {
        return res.status(500).json({
          success: false,
          error: 'API key invalid',
          type: 'api_error',
          message: 'OpenWeatherMap API key is invalid. Please check your API key.'
        });
      } else if (status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          type: 'rate_limit',
          message: 'Too many requests. Please try again later'
        });
      } else {
        return res.status(status).json({
          success: false,
          error: 'Weather service error',
          type: 'api_error',
          message: data.message || 'Unable to fetch weather data'
        });
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        type: 'timeout',
        message: 'Weather service is taking too long to respond'
      });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Network error
      return res.status(503).json({
        success: false,
        error: 'Network error',
        type: 'network_error',
        message: 'Unable to connect to weather service'
      });
    } else {
      // Generic error
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        type: 'server_error',
        message: 'Something went wrong on our end'
      });
    }
  }
});

// Subscribe to alerts endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, phone, city, alertTypes } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: 'Email or phone number is required'
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City is required'
      });
    }

    const result = await alertService.subscribe(email, phone, city, alertTypes || ['rain', 'heat', 'wind']);
    
    res.json({
      success: true,
      message: 'Successfully subscribed to weather alerts',
      id: result.id
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to alerts'
    });
  }
});

// Get subscribers endpoint (admin)
app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await alertService.getSubscribers();
    res.json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscribers'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Alert Dashboard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    apiKeyConfigured: !!(OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your-api-key-here'),
    features: {
      weather: true,
      alerts: true,
      email: !!process.env.EMAIL_USER,
      database: true
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    type: 'not_found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    type: 'server_error',
    message: 'An unexpected error occurred'
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  alertService.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Weather Alert Dashboard API running on port ${PORT}`);
  console.log(`Root endpoint: http://localhost:${PORT}/`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Weather endpoint: http://localhost:${PORT}/api/weather/:city`);
  console.log(`Subscribe endpoint: http://localhost:${PORT}/api/subscribe`);
  console.log(`API Key configured: ${!!(OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your-api-key-here')}`);
});

module.exports = app;
