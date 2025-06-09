require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Movie = require('./movieDB');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/video-streaming';

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

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB successfully');
    
    try {
        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Add new movies
        const result = await Movie.insertMany(movies);
        console.log(`Added ${result.length} movies to database`);
        
        // List all movies
        const allMovies = await Movie.find({});
        console.log('\nMovies in database:');
        allMovies.forEach(movie => {
            console.log(`- ${movie.title} (${movie.path})`);
        });
    } catch (error) {
        console.error('Error adding movies:', error);
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 