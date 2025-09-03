const cron = require('node-cron');
const axios = require('axios');
const AlertService = require('./alerts');
require('dotenv').config();

const alertService = new AlertService();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Get all subscribed cities
async function getSubscribedCities() {
  return new Promise((resolve, reject) => {
    alertService.db.all('SELECT DISTINCT city FROM subscribers WHERE city IS NOT NULL', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(row => row.city));
      }
    });
  });
}

// Check weather for a city
async function checkWeatherForCity(city) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 10000
    });

    await alertService.processAlerts(response.data);
    console.log(`Processed alerts for ${city}`);
  } catch (error) {
    console.error(`Error checking weather for ${city}:`, error.message);
  }
}

// Main cron job function
async function runAlertCheck() {
  console.log('Starting alert check...');
  
  try {
    const cities = await getSubscribedCities();
    
    if (cities.length === 0) {
      console.log('No subscribed cities found');
      return;
    }

    console.log(`Checking weather for ${cities.length} cities:`, cities);
    
    // Process all cities in parallel
    await Promise.all(cities.map(city => checkWeatherForCity(city)));
    
    console.log('Alert check completed');
  } catch (error) {
    console.error('Error in alert check:', error);
  }
}

// Schedule the cron job to run every 3 hours
cron.schedule('0 */3 * * *', () => {
  console.log('Running scheduled alert check...');
  runAlertCheck();
});

// Run immediately on startup
console.log('Alert service started. Running initial check...');
runAlertCheck();

// Keep the process running
process.on('SIGINT', () => {
  console.log('Shutting down alert service...');
  alertService.close();
  process.exit(0);
});

console.log('Alert cron job scheduled to run every 3 hours');
