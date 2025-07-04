const express = require("express");
const fs = require("fs");
const path = require("path");

const Movies = require("./movieDB");

const app = express.Router();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Get all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movies.find().select('title path _id');
        res.status(200).json({
            success: true,
            message: "Movies fetched successfully",
            movies: movies.map(movie => ({
                id: movie._id,
                title: movie.title,
                path: `/api/stream/${movie._id}`
            }))
        });
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch movies' 
        });
    }
});

// Stream video
app.get('/api/stream/:id', async (req, res) => {
    try {
        const video = await Movies.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ 
                success: false, 
                error: 'Video not found' 
            });
        }

        const videoPath = video.path;
        
        // Verify file exists
        if (!fs.existsSync(videoPath)) {
            console.error(`Video file not found at path: ${videoPath}`);
            return res.status(404).json({ 
                success: false, 
                error: 'Video file not found' 
            });
        }

        const videoSize = fs.statSync(videoPath).size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
            const chunksize = (end - start) + 1;
            
            if (start >= videoSize) {
                res.status(416).json({ 
                    success: false, 
                    error: 'Requested range not satisfiable' 
                });
                return;
            }

            const stream = fs.createReadStream(videoPath, { start, end });
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            };

            res.writeHead(206, headers);
            
            stream.on('error', (error) => {
                console.error(`Error streaming video: ${error.message}`);
                if (!res.headersSent) {
                    res.status(500).json({ 
                        success: false, 
                        error: 'Error streaming video' 
                    });
                }
            });

            stream.pipe(res);
        } else {
            const headers = {
                "Content-Length": videoSize,
                "Content-Type": "video/mp4"
            };

            res.writeHead(200, headers);
            const stream = fs.createReadStream(videoPath);
            
            stream.on('error', (error) => {
                console.error(`Error streaming video: ${error.message}`);
                if (!res.headersSent) {
                    res.status(500).json({ 
                        success: false, 
                        error: 'Error streaming video' 
                    });
                }
            });

            stream.pipe(res);
        }
    } catch (err) {
        console.error('Error handling video stream:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;