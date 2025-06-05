require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const route = require("./route");

const PORT = process.env.port;
const HOSTNAME = "localhost";

// Request Management
const app = express();
app.use(express.json());        // A body Parser Required to post a data

app.use('/', route);

// DB
const mongoUri = process.env.mongoatlas;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(res => {
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server is running at ${HOSTNAME}:${PORT}`)
        });
    })
    .catch(err => console.log(err));