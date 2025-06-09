const express = require("express");
const fs = require("fs");
const path = require("path");

const Movies = require("./movieDB");

const app = express.Router();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Get all movies
app.get('/show', async (req, res) => {
    try {
        const movies = await Movies.find().select('title path _id');
        res.status(200).json({
            message: "Movies fetched successfully",
            Movies: movies
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Stream video
app.get('/player', async (req, res) => {
    try {
        const videoId = req.query.id;
        if (!videoId) {
            return res.status(400).json({ error: 'Video ID is required' });
        }

        const video = await Movies.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const videoPath = video.path;
        const videoSize = fs.statSync(videoPath).size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
            const chunksize = (end - start) + 1;
            const stream = fs.createReadStream(videoPath, { start, end });
            
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            };

            res.writeHead(206, headers);
            stream.pipe(res);
        } else {
            const headers = {
                "Content-Length": videoSize,
                "Content-Type": "video/mp4"
            };

            res.writeHead(200, headers);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;