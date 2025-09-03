// Weather Dashboard Application
class WeatherDashboard {
    constructor() {
        // Auto-detect environment and set API URL
        this.apiBaseUrl = this.getApiBaseUrl();
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isMapFullWidth = false;
        this.currentCity = null;
        this.recentCities = JSON.parse(localStorage.getItem('recentCities') || '[]');
        this.favoriteCity = localStorage.getItem('favoriteCity') || null;
        this.compareMode = false;
        this.comparisonData = null;
        
        this.initializeApp();
    }

    getApiBaseUrl() {
        // Auto-detect if running locally or in production
        if (window.location.protocol === 'file:' || 
            window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            // Local development
            return 'http://localhost:3001/api';
        } else {
            // Production - use deployed Render backend
            // Replace this with your actual Render backend URL
            return 'https://weather-alert-dashboard.onrender.com/api';
        }
    }

    initializeApp() {
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.checkServerHealth();
        this.loadFavoriteCity();
        this.displayRecentCities();
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');
        
        searchBtn.addEventListener('click', () => this.searchWeather());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Map resize
        const resizeBtn = document.getElementById('resizeMap');
        resizeBtn.addEventListener('click', () => this.toggleMapSize());

        // Compare mode toggle
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.toggleCompareMode());
        }

        // Export PDF
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToPDF());
        }

        // Favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Compare search button
        const compareSearchBtn = document.getElementById('compareSearchBtn');
        if (compareSearchBtn) {
            compareSearchBtn.addEventListener('click', () => this.compareCities());
        }
    }

    async checkServerHealth() {
        try {
            console.log('Checking server health at:', this.apiBaseUrl);
            const response = await fetch(`${this.apiBaseUrl}/health`);
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Server is healthy:', data);
            
            // Check if API key is configured
            if (!data.apiKeyConfigured) {
                console.warn('⚠️ API key is not configured on the backend');
                this.showError('Weather service is not properly configured. Please contact the administrator.', 'configuration');
            }
        } catch (error) {
            console.error('Server health check failed:', error);
            this.showError(`Unable to connect to weather service: ${error.message}`, 'network');
        }
    }

    async searchWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading(true);
        this.hideError();
        this.hideWeatherData();

        try {
            console.log('Fetching weather for:', city, 'from:', this.apiBaseUrl);
            const response = await fetch(`${this.apiBaseUrl}/weather/${encodeURIComponent(city)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather data');
            }

            if (data.success) {
                this.currentCity = data.data.current;
                this.addToRecentCities(city);
                this.displayWeatherData(data.data);
                this.generateWeatherAlerts(data.data.current, data.data.forecast);
                this.updateMapLocation(data.data.current);
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }

        } catch (error) {
            console.error('Weather fetch error:', error);
            this.handleWeatherError(error, response);
        } finally {
            this.showLoading(false);
        }
    }

    addToRecentCities(city) {
        // Remove if already exists
        this.recentCities = this.recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
        // Add to beginning
        this.recentCities.unshift(city);
        // Keep only last 5
        this.recentCities = this.recentCities.slice(0, 5);
        // Save to localStorage
        localStorage.setItem('recentCities', JSON.stringify(this.recentCities));
        this.displayRecentCities();
    }

    displayRecentCities() {
        const container = document.getElementById('recentCities');
        if (!container) return;

        container.innerHTML = '';
        this.recentCities.forEach(city => {
            const button = document.createElement('button');
            button.className = 'recent-city-btn';
            button.textContent = city;
            button.addEventListener('click', () => {
                document.getElementById('cityInput').value = city;
                this.searchWeather();
            });
            container.appendChild(button);
        });
    }

    loadFavoriteCity() {
        if (this.favoriteCity) {
            document.getElementById('cityInput').value = this.favoriteCity;
            this.searchWeather();
        }
    }

    toggleFavorite() {
        if (!this.currentCity) return;

        const cityName = this.currentCity.name;
        if (this.favoriteCity === cityName) {
            this.favoriteCity = null;
            localStorage.removeItem('favoriteCity');
        } else {
            this.favoriteCity = cityName;
            localStorage.setItem('favoriteCity', cityName);
        }
        this.updateFavoriteButton();
    }

    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!favoriteBtn) return;

        if (this.favoriteCity === this.currentCity?.name) {
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
            favoriteBtn.title = 'Remove from favorites';
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
            favoriteBtn.title = 'Add to favorites';
        }
    }

    toggleCompareMode() {
        this.compareMode = !this.compareMode;
        const compareBtn = document.getElementById('compareBtn');
        const compareSection = document.getElementById('compareSection');
        
        if (this.compareMode) {
            compareBtn.textContent = 'Exit Compare';
            compareSection.style.display = 'block';
            this.comparisonData = null;
        } else {
            compareBtn.textContent = 'Compare Cities';
            compareSection.style.display = 'none';
        }
    }

    async compareCities() {
        const city1 = document.getElementById('compareCity1').value.trim();
        const city2 = document.getElementById('compareCity2').value.trim();

        if (!city1 || !city2) {
            this.showError('Please enter both cities to compare');
            return;
        }

        try {
            const [response1, response2] = await Promise.all([
                fetch(`${this.apiBaseUrl}/weather/${encodeURIComponent(city1)}`),
                fetch(`${this.apiBaseUrl}/weather/${encodeURIComponent(city2)}`)
            ]);

            const data1 = await response1.json();
            const data2 = await response2.json();

            if (data1.success && data2.success) {
                this.displayComparison(data1.data, data2.data);
            } else {
                this.showError('Failed to fetch weather for one or both cities');
            }
        } catch (error) {
            this.showError('Error comparing cities');
        }
    }

    displayComparison(data1, data2) {
        const container = document.getElementById('comparisonResults');
        container.innerHTML = `
            <div class="comparison-cards">
                <div class="comparison-card">
                    <h3>${data1.current.name}</h3>
                    <div class="temp">${Math.round(data1.current.main.temp)}°C</div>
                    <div class="condition">${data1.current.weather[0].description}</div>
                    <div class="details">
                        <div>Humidity: ${data1.current.main.humidity}%</div>
                        <div>Wind: ${Math.round(data1.current.wind.speed * 3.6)} km/h</div>
                    </div>
                </div>
                <div class="comparison-card">
                    <h3>${data2.current.name}</h3>
                    <div class="temp">${Math.round(data2.current.main.temp)}°C</div>
                    <div class="condition">${data2.current.weather[0].description}</div>
                    <div class="details">
                        <div>Humidity: ${data2.current.main.humidity}%</div>
                        <div>Wind: ${Math.round(data2.current.wind.speed * 3.6)} km/h</div>
                    </div>
                </div>
            </div>
        `;
    }

    exportToPDF() {
        if (!this.currentCity) {
            this.showError('No weather data to export');
            return;
        }

        // Create a simple PDF-like report
        const reportData = {
            city: `${this.currentCity.name}, ${this.currentCity.sys.country}`,
            date: new Date().toLocaleDateString(),
            current: {
                temp: Math.round(this.currentCity.main.temp),
                feelsLike: Math.round(this.currentCity.main.feels_like),
                humidity: this.currentCity.main.humidity,
                windSpeed: Math.round(this.currentCity.wind.speed * 3.6),
                pressure: this.currentCity.main.pressure,
                condition: this.currentCity.weather[0].description
            }
        };

        // Create and download a simple text report
        const report = `
WEATHER REPORT
==============
City: ${reportData.city}
Date: ${reportData.date}

Current Weather:
- Temperature: ${reportData.current.temp}°C
- Feels Like: ${reportData.current.feelsLike}°C
- Humidity: ${reportData.current.humidity}%
- Wind Speed: ${reportData.current.windSpeed} km/h
- Pressure: ${reportData.current.pressure} hPa
- Condition: ${reportData.current.condition}

Generated by Smart Weather Dashboard
        `;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `weather-report-${reportData.city.replace(/,/g, '').replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleWeatherError(error, response) {
        let errorMessage = 'An error occurred while fetching weather data';
        let errorType = 'unknown';

        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Network error: Unable to connect to the server. Please check your connection and try again.';
            errorType = 'network';
        } else if (error.message.includes('City not found')) {
            errorMessage = 'City not found. Please check the spelling and try again.';
            errorType = 'city_not_found';
        } else if (error.message.includes('Rate limit')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            errorType = 'rate_limit';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. The weather service is taking too long to respond.';
            errorType = 'timeout';
        } else if (error.message.includes('API key')) {
            errorMessage = 'Weather service configuration error. Please try again later.';
            errorType = 'configuration';
        } else {
            errorMessage = error.message || errorMessage;
        }

        this.showError(errorMessage, errorType);
    }

    displayWeatherData(data) {
        const { current, forecast } = data;
        
        this.displayCurrentWeather(current);
        this.displayForecast(forecast);
        this.showWeatherData();
        this.updateFavoriteButton();
    }

    displayCurrentWeather(weather) {
        // Location
        document.getElementById('currentLocation').textContent = 
            `${weather.name}, ${weather.sys.country}`;

        // Temperature
        document.getElementById('currentTemp').textContent = 
            Math.round(weather.main.temp);

        // Weather icon
        const iconElement = document.getElementById('currentIcon');
        const iconClass = this.getWeatherIconClass(weather.weather[0].icon);
        iconElement.className = `fas ${iconClass}`;

        // Weather details
        document.getElementById('feelsLike').textContent = 
            `${Math.round(weather.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = 
            `${weather.main.humidity}%`;
        document.getElementById('windSpeed').textContent = 
            `${Math.round(weather.wind.speed * 3.6)} km/h`;
        document.getElementById('pressure').textContent = 
            `${weather.main.pressure} hPa`;
    }

    displayForecast(forecast) {
        const container = document.getElementById('forecastContainer');
        container.innerHTML = '';

        forecast.forEach(day => {
            const card = this.createForecastCard(day);
            container.appendChild(card);
        });
    }

    createForecastCard(day) {
        const card = document.createElement('div');
        card.className = 'forecast-card fade-in';

        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const iconClass = this.getWeatherIconClass(day.weather[0].icon);

        card.innerHTML = `
            <div class="forecast-date">${monthDay}</div>
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="forecast-temp">
                <span class="forecast-temp-high">${Math.round(day.main.temp_max)}°</span>
                <span class="forecast-temp-low">${Math.round(day.main.temp_min)}°</span>
            </div>
            <div class="forecast-description">${day.weather[0].description}</div>
        `;

        return card;
    }

    generateWeatherAlerts(currentWeather, forecast) {
        const alerts = [];
        const container = document.getElementById('alertsContainer');
        container.innerHTML = '';

        // Check forecast for rain
        const hasRain = forecast.some(day => 
            day.weather[0].main.toLowerCase().includes('rain') || 
            day.weather[0].main.toLowerCase().includes('drizzle')
        );

        if (hasRain) {
            alerts.push({
                type: 'info',
                icon: 'fa-umbrella',
                title: 'Rain Alert',
                description: 'Carry umbrella 🌧'
            });
        }

        // Check temperature > 35°C
        if (currentWeather.main.temp > 35) {
            alerts.push({
                type: 'severe',
                icon: 'fa-fire',
                title: 'Heat Warning',
                description: 'Stay hydrated 🥵'
            });
        }

        // Check wind speed > 50 km/h
        const windSpeedKmh = currentWeather.wind.speed * 3.6;
        if (windSpeedKmh > 50) {
            alerts.push({
                type: 'warning',
                icon: 'fa-wind',
                title: 'High Winds Warning',
                description: 'High winds warning 🌪'
            });
        }

        // Display alerts
        if (alerts.length === 0) {
            const noAlertsCard = document.createElement('div');
            noAlertsCard.className = 'alert-card info';
            noAlertsCard.innerHTML = `
                <div class="alert-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">All Clear</div>
                    <div class="alert-description">No weather alerts at this time.</div>
                </div>
            `;
            container.appendChild(noAlertsCard);
        } else {
            alerts.forEach(alert => {
                const alertCard = this.createAlertCard(alert);
                container.appendChild(alertCard);
            });
        }
    }

    createAlertCard(alert) {
        const card = document.createElement('div');
        card.className = `alert-card ${alert.type} fade-in`;

        card.innerHTML = `
            <div class="alert-icon">
                <i class="fas ${alert.icon}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-description">${alert.description}</div>
            </div>
        `;

        return card;
    }

    updateMapLocation(weather) {
        const lat = weather.coord.lat;
        const lon = weather.coord.lon;
        const mapFrame = document.getElementById('mapFrame');
        
        // Update map to center on the searched city
        const mapUrl = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=10`;
        mapFrame.src = mapUrl;
    }

    getWeatherIconClass(iconCode) {
        const iconMap = {
            '01d': 'fa-sun',
            '01n': 'fa-moon',
            '02d': 'fa-cloud-sun',
            '02n': 'fa-cloud-moon',
            '03d': 'fa-cloud',
            '03n': 'fa-cloud',
            '04d': 'fa-cloud',
            '04n': 'fa-cloud',
            '09d': 'fa-cloud-rain',
            '09n': 'fa-cloud-rain',
            '10d': 'fa-cloud-sun-rain',
            '10n': 'fa-cloud-moon-rain',
            '11d': 'fa-bolt',
            '11n': 'fa-bolt',
            '13d': 'fa-snowflake',
            '13n': 'fa-snowflake',
            '50d': 'fa-smog',
            '50n': 'fa-smog'
        };
        return iconMap[iconCode] || 'fa-cloud';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    toggleMapSize() {
        const mapContainer = document.getElementById('weatherMap');
        const resizeBtn = document.getElementById('resizeMap');
        const icon = resizeBtn.querySelector('i');
        
        this.isMapFullWidth = !this.isMapFullWidth;
        
        if (this.isMapFullWidth) {
            mapContainer.classList.add('full-width');
            icon.className = 'fas fa-compress-arrows-alt';
            resizeBtn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> Toggle Normal Size';
        } else {
            mapContainer.classList.remove('full-width');
            icon.className = 'fas fa-expand-arrows-alt';
            resizeBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> Toggle Full Width';
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.add('show');
        } else {
            spinner.classList.remove('show');
        }
    }

    showError(message, type = 'error') {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.className = `error-message show ${type}`;
    }

    hideError() {
        const errorElement = document.getElementById('errorMessage');
        errorElement.classList.remove('show');
    }

    showWeatherData() {
        const sections = ['currentWeather', 'weatherAlerts', 'forecast', 'mapSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            section.classList.remove('hidden');
            section.classList.add('fade-in');
        });
    }

    hideWeatherData() {
        const sections = ['currentWeather', 'weatherAlerts', 'forecast'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            section.classList.add('hidden');
            section.classList.remove('fade-in');
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
