const express = require("express"); // a function reference
const app = express(); // a function object
const path = require('path');

app.use(express.json()); // JSON body to JS objects

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type,Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.static(__dirname + "/public")); // __dirname: Current directory with index.js
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public', 'index.html'))); // Default base URL to home page

const PORT = process.env.PORT || 3000; // process.env.PORT or 3000
app.listen(PORT, () => console. log(`Server started on port ${PORT}!`));