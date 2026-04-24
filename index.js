require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // a function reference
const app = express(); // a function object
const mongoose=require("mongoose");
const path = require('path');

const userRoutes = require("./server/routes/user"); // A router object containing the user routes

const postRoutes = require("./server/routes/post"); // A router object containing the post routes

app.use(express.json()); // JSON body to JS objects

app.use(express.static(__dirname + "/public")); // __dirname: Current directory with index.js
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public', 'index.html'))); // Default base URL to home page

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type,Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use('/user', userRoutes); // Use the user routes for any URL starting with /user
app.use('/post', postRoutes); // Use the post routes for any URL starting with /post

const PORT = process.env.PORT || 5000; // process.env.PORT or 5000

async function startServer() {
    try {
        await mongoose.connect(process.env.dbURL);
        await mongoose.model("Post").syncIndexes();
        console.log("DB Connected ! !");
        app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();