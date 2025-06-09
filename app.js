require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const route = require("./route");

// Environment variables with fallbacks
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/video-streaming';
const HOSTNAME = process.env.HOSTNAME || "localhost";

// Express app setup
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));  // To serve index.html and style.css

// Routes
app.use('/', route);

// Database connection
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, HOSTNAME, () => {
        console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});