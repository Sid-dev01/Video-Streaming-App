require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Movie = require('./movieDB');

const MONGODB_URI = process.env.MONGODB_URI || process.env.ATLAS_URI || 'mongodb://localhost:27017/video-streaming';

// MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
};

// Sample movies data
const movies = [
    {
        title: "Cars",
        path: path.join(__dirname, 'cars1.mp4')
    },
    {
        title: "Planes",
        path: path.join(__dirname, 'planes.mp4')
    },
    {
        title: "Shrek",
        path: path.join(__dirname, 'shrek.mp4')
    },
    {
        title: "Kung Fu Panda",
        path: path.join(__dirname, 'panda.mp4')
    },
    {
        title: "Kung Fu Panda 3",
        path: path.join(__dirname, 'panda3.mp4')
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        console.log('Connected to MongoDB successfully!');
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);

        // Clear existing movies
        console.log('Clearing existing movies...');
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Add new movies
        console.log('Adding new movies...');
        const result = await Movie.insertMany(movies);
        console.log(`Added ${result.length} movies to database`);
        
        // List all movies
        const allMovies = await Movie.find({});
        console.log('\nMovies in database:');
        allMovies.forEach(movie => {
            console.log(`- ${movie.title} (${movie.path})`);
        });

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        // Close the connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('Database connection closed');
        }
        process.exit(0);
    }
}

// Run the seeding function
seedDatabase(); 