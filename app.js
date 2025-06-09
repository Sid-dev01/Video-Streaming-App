require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const route = require("./route");

// Environment variables with fallbacks
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const HOSTNAME = process.env.HOSTNAME || "localhost";

// Express app setup
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));  // To serve index.html and style.css

// Routes
app.use('/', route);

// MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Database connection with retry logic
const connectWithRetry = async (retries = 5, interval = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Connecting to MongoDB... Attempt ${i + 1}/${retries}`);
            await mongoose.connect(MONGODB_URI, mongooseOptions);
            console.log('Connected to MongoDB successfully!');
            console.log(`Database: ${mongoose.connection.name}`);
            console.log(`Host: ${mongoose.connection.host}`);
            return true;
        } catch (err) {
            console.error(`Connection attempt ${i + 1} failed:`, err.message);
            if (i < retries - 1) {
                console.log(`Retrying in ${interval/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
    }
    return false;
};

// Start server only after successful database connection
connectWithRetry()
    .then(success => {
        if (success) {
            app.listen(PORT, () => {
                console.log(`Server is running on port${PORT}`);
            });

            // Handle MongoDB connection errors after initial connection
            mongoose.connection.on('error', err => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected. Attempting to reconnect...');
                connectWithRetry();
            });

            process.on('SIGINT', () => {
                mongoose.connection.close(() => {
                    console.log('MongoDB connection closed through app termination');
                    process.exit(0);
                });
            });
        } else {
            console.error('Failed to connect to MongoDB after multiple retries');
            process.exit(1);
        }
    });