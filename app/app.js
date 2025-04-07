//THE OFFICIAL BACKEND APPLICATION FOR 'GAME TIPS & TRICKS (GTT)'
//Written By. Keisha Geyrozaga, Anderson Ricardo Gomes Ballestroz, Mohammad Rohan, Angelo Bongon
//Last Updated: 12/03/2025

// [KEISHA] Update1: Redid the backend environment, due to download difficulties regarding loading/starting PUG.

// Import express.js
const express = require("express");

//Imports express-session and bcrypt (used for user authentication)
const session = require("express-session");
const bcrypt = require("bcryptjs");

// Create express app
var app = express();

app.set('view engine','pug');
app.set('views','./app/views');

// Add static files location
app.use(express.static("static"));

// Sets up session middleware
app.use(session({
    secret: 'secretkeysudgsajibdwu',
    resave: false,
    saveUninitialized: true
  }));

// Get the functions in the db.js file to use ((includes the line of code that makes POST form submissions possible))
const db = require('./services/db');
app.use(express.urlencoded({ extended: true }));



// WEBPAGE: HOMEPAGE
// It fetches tips with associated games, users, & categories
app.get("/", function (req, res) {
    var tSql = `
        SELECT Tip.tipID, Tip.title AS tipTitle, Tip.content, Tip.createdAt,
               Game.title AS gameTitle, User.username,
               COALESCE(GROUP_CONCAT(Category.name SEPARATOR ', '), 'None') AS categories
        FROM Tip
        JOIN Game ON Tip.gameID = Game.gameID
        JOIN User ON Tip.userID = User.userID
        LEFT JOIN TipCategory ON Tip.tipID = TipCategory.tipID
        LEFT JOIN Category ON TipCategory.categoryID = Category.categoryID
        GROUP BY Tip.tipID
        ORDER BY Tip.createdAt DESC
    `;

    db.query(tSql).then(results => {
        results.forEach(tip => {
            tip.createdAt = new Date(tip.createdAt); // Convert to Date object
        });

        const currentUser = req.session.username || null;
        res.render('homepage', { tips: results, user: currentUser });
    });
});


// HOMEPAGE TEST ATTEMPT
app.get("/homepage", function (req, res) {
    res.render("homepage", { title: "GTT" });
});

// WEBPAGE: FORUM(S)
// Based on the tip's associated tip ID (tID), a forum post with comments beneath will be shown
app.get("/forum/:tipID", function (req, res) {
    var tipID = req.params.tipID;

    var tipSQL = `
        SELECT Tip.tipID, Tip.title AS tipTitle, Tip.content, Tip.createdAt, User.username, User.userID
        FROM Tip
        JOIN User ON Tip.userID = User.userID
        WHERE Tip.tipID = ?;
    `;

    var commentSQL = `
        SELECT Comments.commentID, Comments.comment AS commentContent, Comments.createdAt, User.username, User.userID
        FROM Comments
        JOIN User ON Comments.userID = User.userID
        WHERE Comments.tipID = ?
        ORDER BY Comments.createdAt ASC;
    `;

    db.query(tipSQL, [tipID]).then(tipResults => {
        if (!tipResults || tipResults.length === 0) {
            return res.status(404).send("Tip not found");
        }

        var tip = tipResults[0];

        db.query(commentSQL, [tipID]).then(commentResults => {
            res.render("forum", { tip: tip, comments: commentResults, user: req.session });
        });
    });
});

// WEBPAGE: TIP CATEGORIES
app.get("/category/:category", function (req, res) {
    var category = req.params.category;

    category = category.toUpperCase();

    var sql = `
        SELECT t.tipID, t.title, t.content, t.createdAt,
               u.username, u.userID,
               g.title AS gameTitle, c.name
        FROM Tip t
        JOIN TipCategory ON t.tipID = TipCategory.tipID
        JOIN Category c ON TipCategory.categoryID = c.categoryID
        JOIN User u ON t.userID = u.userID
        JOIN Game g ON t.gameID = g.gameID
        WHERE c.name = ?
    `;

    db.query(sql, [category]).then(results => {
        res.render("category", { category: category, tips: results });
    });
});

// WEBPAGE: TIP GAME TITLES
app.get("/game/:gametitle", function (req, res) {
    var gametitle = req.params.gametitle;

    gametitle = gametitle.toUpperCase();

    var sql = `
        SELECT t.tipID, t.title, t.content, t.createdAt,
               u.username, u.userID,
               g.title AS gameTitle, g.description, g.releaseDate, g.developer
        FROM Tip t
        JOIN Game g ON t.gameID = g.gameID
        JOIN User u ON t.userID = u.userID
        WHERE g.title = ?
    `;

    console.log(gametitle);

    db.query(sql, [gametitle]).then(results => {
        var gameInfo = results.length > 0 ? results[0] : null;

        res.render("gamepage", {
            gametitle: gametitle,
            tips: results,
            game: gameInfo
        });
    });
});

// WEBPAGE: EDIT GAME
// Route to display the edit game form
app.get("/edit-game/:gametitle", (req, res) => {
    const gametitle = req.params.gametitle.toUpperCase();
  
    const sql = "SELECT * FROM Game WHERE title = ?";
  
    db.query(sql, [gametitle]).then(result => {
      if (result.length === 0) {
        return res.status(404).send("Game not found.");
      }
  
      const game = result[0]; // Get the first result (the game)
      res.render("edit-game", { game });
    }).catch(err => {
      console.error("Error fetching game for editing:", err);
      res.status(500).send("Failed to load game for editing.");
    });
});

// Route to handle the form submission to update game details
app.post("/edit-game/:gametitle", async (req, res) => {
    const { title, description, releaseDate, developer } = req.body;
    const gametitle = req.params.gametitle.toUpperCase();
  
    if (!title || !description || !releaseDate || !developer) {
      return res.status(400).send("All fields are required.");
    }
  
    try {
      const updateGameSql = `
        UPDATE Game 
        SET title = ?, description = ?, releaseDate = ?, developer = ? 
        WHERE title = ?
      `;
      await db.query(updateGameSql, [title, description, releaseDate, developer, gametitle]);
  
      res.redirect(`/game/${title.toUpperCase()}`);
    } catch (err) {
      console.error("Error updating game:", err);
      res.status(500).send("Failed to update the game.");
    }
});
  

// WEBPAGE: USER PROFILE
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
                        tips: tipResults,
                        user: req.session
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

// WEBPAGE: USER STATISTICS
// Creates a route for /userstatistics and fetches user data to individual users registered in the GTT DB
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

    // Query the user profile data from the 'User' and 'Profile' tables in the GTT DB
    db.query(uSQL, [uID]).then(userResults => {
        if (userResults.length > 0) {
            var user = userResults[0]; // Since we expect one result

            // Query the user's badges from the 'Badge' and 'Badge Criteria' table in the GTT DB
            db.query(bSQL, [uID]).then(badgeResults => {

                // Query the user's total tips, comments, and likes and fetch the information from 'Tip' table in the GTT DB
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
                                },
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


//WEBPAGE: LOGIN PAGE
// Basic login function, creates weboage title and renders the login.pug file
app.get("/login", function (req, res) {
    res.render("login", { title: "Login Page" });
});

// Improves the feature to implement user authentication (and some super-cool password hashing)
app.post("/login", function (req, res) {
    const { username, password } = req.body;
  
    const sql = `SELECT * FROM User WHERE username = ?`;
  
    db.query(sql, [username]).then(results => {
      if (results.length === 0) {
        return res.send("Invalid username or password");
      }
  
      const user = results[0];
  
      bcrypt.compare(password, user.password).then(match => {
        if (match) {
          // Set session data
          req.session.userID = user.userID;
          req.session.username = user.username;
  
          res.redirect("/");
        } else {
          res.send("Invalid username or password");
        }
      });
    });
  });

//WEBPAGE: SIGNUP PAGE
// Basic signup function, creates weboage title and renders the login.pug file
app.get("/signup", function (req, res) {
    res.render("signup", { title: "Signup Page" });
});

// Improves the feature to implement user authentication (AND PASSWORD HASHING <3 teehee)
app.post("/signup", function (req, res) {
    const { username, email, password } = req.body;
  
    bcrypt.hash(password, 10).then(hashedPassword => {
      const sql = `INSERT INTO User (username, email, password) VALUES (?, ?, ?)`;
  
      db.query(sql, [username, email, hashedPassword])
        .then(() => {
          res.redirect("/login");
        });
    });
  });

// NOTE THAT PREEXISTING DATA IN 'User' TABLE HAS SPECIFIC HASHED PASSWORDS, here's the unhashed versions
// (1) JohnDoe = beep
// (2) JaneyPlainy = boop
// (3) MikeWazWOWski = belladonna

// WEBPAGE cmd: logs out the user by destroying the express-session, allowing a new user to login in  
app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// ((TESTING)) TIP CREATION
app.get("/create", async function (req, res) {
    try {
      const gamesSql = `SELECT gameID, title FROM Game`;
      const categoriesSql = `SELECT categoryID, name FROM Category`;
  
      const [gamesResult, categoriesResult] = await Promise.all([
        db.query(gamesSql),
        db.query(categoriesSql),
      ]);
  
      const games = gamesResult.rows || gamesResult;
      const categories = categoriesResult.rows || categoriesResult;
  
      res.render("create", {
        title: "Create a Tip",
        user: req.session.username || null,
        games,
        categories,
      });
    } catch (err) {
      console.error("Error loading create form:", err);
      res.status(500).send("Failed to load create tip form.");
    }
  });
  
app.post("/create", async (req, res) => {
    const { title, content, gameID, newGame, categoryID = [], newCategory } = req.body;
    const userID = req.session.userID;

    // Ensures that title and content textareas are filled in (they cannot be empty)
    if (!title || !content) {
        return res.status(400).send("Title and content are required.");
    }
      
    // Ensures that, at least, one game must be associated with the tip (they cannot be empty)
    if ((!gameID || gameID === "") && (!newGame || newGame.trim() === "")) {
      return res.status(400).send("You must select an existing game or add a new one.");
    }
    
    // Ensures that, at least, one category must be associated with the tip (they cannot be empty)
    if ((!categoryID || categoryID === "") && (!newCategory || newCategory.trim() === "")) {
      return res.status(400).send("You must select an existing category or add a new one.");
    }
  
    try {
      // Use the selected game or insert new game if provided
      let finalGameID = gameID;
  
      if (newGame && newGame.trim() !== "") {
        // Insert new game into Game table
        const newGameResult = await db.query(
          "INSERT INTO Game (title) VALUES (?)", 
          [newGame.trim()]
        );
        finalGameID = newGameResult.insertId; // Get the newly inserted gameID
      }
  
      // Use the selected categories or insert new category if provided
      let newCategoryID = null;
      if (newCategory && newCategory.trim() !== "") {
        // Insert new category into Category table
        const newCategoryResult = await db.query(
          "INSERT INTO Category (name) VALUES (?)",
          [newCategory.trim()]
        );
        newCategoryID = newCategoryResult.insertId; // Get the newly inserted categoryID
      }
  
      // Insert the new tip with selected or newly created game and category
      const tipResult = await db.query(
        "INSERT INTO Tip (title, content, gameID, userID) VALUES (?, ?, ?, ?)",
        [title, content, finalGameID, userID]
      );
      const tipID = tipResult.insertId;
  
      // Insert into TipCategory table (mapping the tip to categories)
      const rawCategoryIDs = Array.isArray(categoryID) ? categoryID : [categoryID];
      const categoryIDs = rawCategoryIDs.filter(id => id && id !== "");

if (newCategoryID) categoryIDs.push(newCategoryID);

  
      // Insert tip-category relationships
      const insertCategoryPromises = categoryIDs.map(id =>
        db.query("INSERT INTO TipCategory (tipID, categoryID) VALUES (?, ?)", [tipID, id])
      );
      await Promise.all(insertCategoryPromises);
  
      // Redirect to the homepage after the tip is created
      res.redirect("/");
    } catch (err) {
      console.error("Error creating tip:", err);
      res.status(500).send("Failed to create tip.");
    }
  });
  




//Tests connection to the Game_Tips_and_Tricks databse
//Fetches the data from the 'User' table
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


// Starts theserver on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});