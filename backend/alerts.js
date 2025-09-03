const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class AlertService {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'alerts.db'));
        this.initDatabase();
        this.setupEmailTransporter();
    }

    initDatabase() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    phone TEXT UNIQUE,
                    city TEXT,
                    alert_types TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
        });
    }

    setupEmailTransporter() {
        // Configure email transporter (using Gmail as example)
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async subscribe(email, phone, city, alertTypes) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO subscribers (email, phone, city, alert_types)
                VALUES (?, ?, ?, ?)
            `);
            
            stmt.run([email, phone, city, JSON.stringify(alertTypes)], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
            
            stmt.finalize();
        });
    }

    async sendEmailAlert(subscriber, weatherData, alertType) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: subscriber.email,
            subject: `Weather Alert: ${alertType.title}`,
            html: `
                <h2>Weather Alert for ${weatherData.name}</h2>
                <p><strong>Alert:</strong> ${alertType.description}</p>
                <p><strong>Current Temperature:</strong> ${Math.round(weatherData.main.temp)}°C</p>
                <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <hr>
                <p><small>This alert was sent by Smart Weather Dashboard</small></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email alert sent to ${subscriber.email}`);
        } catch (error) {
            console.error('Email sending failed:', error);
        }
    }

    async checkAlerts(weatherData) {
        const alerts = [];
        
        // Check for rain
        if (weatherData.weather[0].main.toLowerCase().includes('rain')) {
            alerts.push({
                type: 'rain',
                title: 'Rain Alert',
                description: 'Rain detected in your area. Carry an umbrella!'
            });
        }

        // Check temperature
        if (weatherData.main.temp > 35) {
            alerts.push({
                type: 'heat',
                title: 'Heat Warning',
                description: 'Extreme heat detected. Stay hydrated!'
            });
        }

        // Check wind
        if (weatherData.wind.speed * 3.6 > 50) {
            alerts.push({
                type: 'wind',
                title: 'High Winds Warning',
                description: 'High winds detected. Secure loose objects!'
            });
        }

        return alerts;
    }

    async processAlerts(weatherData) {
        const alerts = await this.checkAlerts(weatherData);
        
        if (alerts.length === 0) return;

        // Get subscribers for this city
        const subscribers = await this.getSubscribers(weatherData.name);
        
        for (const subscriber of subscribers) {
            const alertTypes = JSON.parse(subscriber.alert_types || '[]');
            
            for (const alert of alerts) {
                if (alertTypes.includes(alert.type) && subscriber.email) {
                    await this.sendEmailAlert(subscriber, weatherData, alert);
                }
            }
        }
    }

    getSubscribers(city) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM subscribers WHERE city = ?',
                [city],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = AlertService;
