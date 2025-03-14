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
    var test_data = ['one', 'two', 'three', 'four'];
    res.render("index3", {'title': 'My Index Page', 'heading':'My heading', 'data': test_data});
});

// Attempts to create a route for /userprofile (connects to respective PUG file)
app.get("/userprofile/:userID", function(req, res) {
    var uID = req.params.userID;
    
    // SQL query to fetch the user's profile data
    var uSQL = `
        SELECT u.username, u.email, u.date_joined, p.progress
        FROM User u
        JOIN Profile p ON p.userID = u.userID
        WHERE u.userID = ?
    `;

    // SQL query to fetch badges the user has earned
    var bSQL = `
        SELECT b.name AS badgeName, b.description AS badgeDescription
        FROM Badge b
        JOIN UserBadge ub ON ub.badgeID = b.badgeID
        WHERE ub.userID = ?
    `;
    
    // SQL query to fetch tips contributed by the user
    var tSQL = `
        SELECT t.tipID, t.title, t.createdAt
        FROM Tip t
        WHERE t.userID = ?
    `;

    // Query the user profile data
    db.query(uSQL, [uID]).then(userResults => {
        if (userResults.length > 0) {
            var user = userResults[0]; // Since we expect one result

            // Query the user's badges
            db.query(bSQL, [uID]).then(badgeResults => {
                // Query the user's tips
                db.query(tSQL, [uID]).then(tipResults => {
                    // Render the profile page and pass the data
                    res.render('userprofile', {
                        user: user,
                        badges: badgeResults,
                        tips: tipResults
                    });
                });
            });
        } else {
            // Handle case where user is not found
            res.status(404).send('User not found');
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send('Internal server error');
    });
});

// Create a route for /userstatistics and fetch user data
app.get("/userstatistics/:userID", function(req, res) {
    var uID = req.params.userID;

    // SQL query to fetch user's profile and stats data
    var uSQL = `
        SELECT u.username, u.email, u.date_joined, p.progress
        FROM User u
        JOIN Profile p ON p.userID = u.userID
        WHERE u.userID = ?
    `;

    // SQL query to fetch badges the user has earned
    var bSQL = `
        SELECT b.name AS badgeName, b.description AS badgeDescription, ub.earned_at
        FROM Badge b
        JOIN UserBadge ub ON ub.badgeID = b.badgeID
        WHERE ub.userID = ?
    `;
    
    // SQL query to fetch total tips posted by the user
    var tSQL = `
        SELECT COUNT(*) AS totalTips
        FROM Tip
        WHERE userID = ?
    `;

    // SQL query to fetch total comments made by the user
    var cSQL = `
        SELECT COUNT(*) AS totalComments
        FROM Comments
        WHERE userID = ?
    `;

    // SQL query to fetch total likes received by the user
    var lSQL = `
        SELECT SUM(likeCounter) AS totalLikes
        FROM Comments
        WHERE userID = ?
    `;

    // Query the user profile data
    db.query(uSQL, [uID]).then(userResults => {
        if (userResults.length > 0) {
            var user = userResults[0]; // Since we expect one result

            // Query the user's badges
            db.query(bSQL, [uID]).then(badgeResults => {

                // Query the user's total tips, comments, and likes
                db.query(tSQL, [uID]).then(tipResults => {
                    db.query(cSQL, [uID]).then(commentResults => {
                        db.query(lSQL, [uID]).then(likeResults => {
                            // Pass all the data to the PUG template
                            res.render('userstatistics', {
                                user: user,
                                badges: badgeResults,
                                stats: {
                                    totalTips: tipResults[0].totalTips,
                                    totalComments: commentResults[0].totalComments,
                                    totalLikes: likeResults[0].totalLikes
                                }
                            });
                        });
                    });
                });
            });
        } else {
            res.status(404).send('User not found');
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send('Internal server error');
    });
});

app.get("/login", function (req, res) {
    res.render("login_signup", { title: "Login | Signup" });
});


//Tests connection to the Game_Tips_and_Tricks databse
// Fetches the data from the 'User' table
app.get("/all-users", function(req, res) {
    var sql = 'select * from User';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    })
});

//Tests connection to the Game_Tips_and_Tricks database by displaying different users
//Collects data from the Game_Tips_and_Tricks db and outputs it into a table format
app.get("/all-users-formatted", function(req, res) {
    var sql = 'select * from User';
    var output = '<table border = 1px>';
    db.query(sql).then(results => {
        for (var row of results) {
            output += '<tr>';
            output += '<td>' + row.userID + '</td>';
            output += '<td>' + '<a href="./single-user/' + row.userID + '">' + row.username + '</a>' + '</td>';
            output += '</tr>';
        }
        output += '</table>';
        res.send(output);
    })
});

//Connects to the route above to obtain data from individual users
app.get("/single-user/:userID", function(req, res) {
    var uID = req.params.userID;
    console.log(uID);
    var uSQL = "SELECT u.username as username, p.progress as title\
    FROM User u\
    JOIN Profile p on p.profileID = u.userID\
    WHERE u.userID=?";
    var bSQL = "SELECT b.name as Badge, bc.requirement as Requirement from Badge b\
    JOIN BadgeCriteria bc on bc.criteriaID = b.badgeID\
    WHERE b.badgeID=1";

    db.query(uSQL, [uID]).then(results => {
        console.log(results);
        res.send(uID);
        var Badge = results[0];
        output = '';
        output += '<div><b>Username: </b>' + results[0].username + '</div>';
        output += '<div><b>Title: </b>' + results[0].title + '</div>';

        //Now we call the db for the badge info (?)
        db.query(bSQL, [uID]).then(results => {
            output += '<table border="1px">';
            for (var row of results) {
                output += '<tr>';
                output += '<td>' + row.badge + '</td>';
                output += '<td>' + row.requirement + '</td>';
                output += '</tr>';
            }
            output += '</table>';
            res.send(output);
        })
    })
});

// Create a route for /goodbye and responds to a 'GET' request
// Tests connection to the localhost (via port 3000)
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});