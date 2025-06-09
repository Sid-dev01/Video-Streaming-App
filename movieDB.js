const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', movieSchema);