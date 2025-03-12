//THE OFFICIAL BACKEND APPLICATION FOR 'GAME TIPS & TRICKS (GTT)'
//Written By. Keisha Geyrozaga, Anderson Ricardo Gomes Ballestroz, Mohammad Rohan, Angelo Bongon
//Last Updated: 12/03/2025

// [KEISHA] Update1: Redid the backend environment, due to download difficulties regarding loading/starting PUG.

// Import express.js
const express = require("express");

// Create express app
var app = express();

app.set('view engine','pug');
app.set('views','./app/views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.render("index");
});
// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});