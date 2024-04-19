const { check, validationResult } = require('express-validator'); 
module.exports = function(app) {
    // import needed dependencies
    const mysql = require('mysql');
    const bcrypt = require('bcrypt');
    
    app.post('/registeruser',
        [
            // validate each field against specific criteria
            check('firstname').matches(/^[a-zA-Z]+$/).withMessage('First name is required'),
            check('lastname').matches(/^[a-zA-Z]+$/).withMessage('Last name is required'),
            check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
            check('username').notEmpty().withMessage('Username is required').isLength({ max: 15 }).withMessage('Username must be shorter than 15 characters'),
            check('password').notEmpty().withMessage('Password is required')
            .matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/)
            .withMessage('Password must be at least 8 characters long and include numbers, uppercase letters, and special characters')
            
    ], (req, res) => {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log any validation errors and redirect to register page
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        } 
        else {
            const saltRounds = 10; 
            const plainPassword = req.body.password;

            // check if username exists in database
            let usernameQuery = "SELECT username FROM user_details WHERE username = ?";
            let newrecord = [req.body.username];

            db.query(usernameQuery, newrecord, (err, result) => {
                if (err) {
                return console.error(err.message);
            }

            const existingUsername = result;

            if (existingUsername.length > 0) {
                // return error to user
                return res.send("Username already exists");
            }


            // hash password and insert user details into database
            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) { 
                let sqlquery = "INSERT INTO user_details (firstname, surname, email, username, hashedPassword) VALUES (?,?,?,?,?)";
        
                // execute sql query
                let newrecord = [req.body.firstname, req.body.lastname, req.body.email, req.body.username, hashedPassword];
        
                db.query(sqlquery, newrecord, (err, result) => {
                    if (err) {
                        console.log('Error registering user', err);
                        res.status(500).send('Error registering user');
                    }
                    else {
                        let userName = req.body.username;
                        console.log('User registered successfully');
                        res.status(200).send('User registered successfully');
                    }
                });
            }); 
        });
        }
    });
    app.post('/loginuser', (req, res) => {
        // query to select the hashed password via the username
        let sqlquery = "SELECT hashedPassword FROM user_details WHERE username = ?";
        let newrecord = [req.body.username];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                if (result.length === 0) {
                    // redirect to log in if there is no matching user
                    res.send({message: "Username does not exist"});
                } else {
                    const hashedPassword = result[0].hashedPassword; 
    
                    bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
                        if (err) {
                            // return error to user
                            res.send({message: "Cannot find user"});
                        } else if (result === true) {
                            // save user session here, when login is successful 
                            req.session.userId = req.body.username; 
                            console.log('logged in');
                            console.log(result);
                            console.log(req.session.userId);
                            console.log(req.session);
                            res.send(result);
                        } else {
                            res.send('Error');
                        }
                    });
                }
            }
        }); 
    });
    app.get('/logout', (req, res) => {
        console.log("logout " + req.session.userId);
        req.session.destroy(err => {
            if (err) {
                return console.error(err.message);
            }
            console.log('logged out');
            res.json({ loggedIn: false }); // Send JSON response
        });
    });
    app.get('/auth', (req, res) => {
        console.log(req.session);
        console.log(req.session.userId);
        if (req.session.userId) {
            // user is logged in
            res.json({ loggedIn: true, userId: req.session.userId });
        } else {
            // user is not logged in
            res.json({ loggedIn: false });
        }
    });
    app.get('/getitems', (req, res) => {
        console.log("get " + req.session.userId);
        console.log(req.session)
        let sqlquery = "SELECT task, task_id FROM daily_tasks";

        db.query(sqlquery, (err, result) => {
            if (err) {
                console.log('Error getting items', err);
                res.status(500).send('Error getting items');
            }
            else {
                console.log('Items successfully received');
                res.json({ items: result });
            }
        });
    });
    app.post('/additem', (req, res) => {
        console.log('Post item id:' + req.session.userId);
        console.log(req.body);

        // Extract the task text, date, and userId from the request body
        const { text, date, userId } = req.body;

        let sqlquery = "INSERT INTO daily_tasks (task, task_date, user_id) VALUES (?, ?, ?)";
        let newrecord = [text, date, userId];

        console.log(newrecord);
      
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            console.log('Error adding item:', err);
            res.status(500).send('Error adding item');
          } 
          else {
            console.log('Item added successfully');
            res.status(200).send('Item added successfully');
          }
        });
    });
    app.post('/deleteitem', (req, res) => {
        let itemId = req.body.itemId; 
        let sqlquery = "DELETE FROM daily_tasks WHERE task_id = ?";

        db.query(sqlquery, [itemId], (err, result) => {
            if (err) {
                console.log('Error deleting item:', err);
                res.status(500).send('Error deleting item');
            } 
            else {
                console.log('Item deleted successfully');
                res.status(200).send('Item deleted successfully');
            }
        });
    });
    app.get('/getdate', (req, res) => {
        let currentDate = new Date();
        console.log(currentDate);
    
        // Extract date components
        let dayOfWeek = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
        let date = currentDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        let time = currentDate.toLocaleTimeString('en-GB');
    
        // Create a JSON object with the date components
        let dateInfo = {
            dayOfWeek: dayOfWeek,
            date: date,
            time: time
        };
    
        // Send the JSON object
        res.status(200).json(dateInfo);
    });  
    app.get('/new', (req, res) => {
        console.log(req.session.userId);
        res.send(req.session.userId);
    });     
    app.get('/retrieveitems', (req, res) => {
        // Get the date and userID from query parameters
        const { date, userId } = req.query;
        console.log('Date: ' + date);
        console.log('user: ' + userId);
    
        console.log('retrieve items for date:', date, 'and user ID:', userId);
    
        // Construct the SQL query with parameters
        let sqlquery = "SELECT task, task_id FROM daily_tasks WHERE task_date = ? AND user_id = ?";
        let newrecord = [date, userId];
    
        // Execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting items', err);
                res.status(500).send('Error getting items');
            } else {
                console.log('Items successfully received');
                res.json({ items: result });
            }
        });
    });    
    app.post('/savegratitude', (req, res) => {
        const { text, date, userId } = req.body;

        let sqlquery = "INSERT INTO gratitude (item, gratitude_date, user_id) VALUES (?, ?, ?)";
        let newrecord = [text, date, userId];

        console.log(newrecord);
      
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            console.log('Error adding item:', err);
            res.status(500).send('Error adding item');
          } 
          else {
            console.log('Item added successfully');
            res.status(200).send('Item added successfully');
          }
        });
    });
    app.get('/getgratitude', (req, res) => {
        const { date, userId } = req.query;
        console.log('Date: ' + date);
        console.log('user: ' + userId);
    
        console.log('retrieve items for date:', date, 'and user ID:', userId);
    
        // Construct the SQL query with parameters
        let sqlquery = "SELECT item, gratitude_id FROM gratitude WHERE gratitude_date = ? AND user_id = ?";
        let newrecord = [date, userId];
    
        // Execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting items', err);
                res.status(500).send('Error getting items');
            } else {
                console.log('Items successfully received');
                res.json({ items: result });
            }
        });
    });
    app.post('/postcheckin', (req, res) => {
        console.log('post check in');
        const { mood_rating, date, emotion_one, emotion_two, emotion_three, userId } = req.body;

        let sqlquery = "INSERT INTO checkin (mood_rating, checkin_date, emotion_one, emotion_two, emotion_three, user_id) VALUES (?, ?, ?, ?, ?, ?)";
        let newrecord = [mood_rating, date, emotion_one, emotion_two, emotion_three, userId];

        console.log(emotion_one);

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              console.log('Error adding checkin:', err);
              res.status(500).send('Error adding checkin');
            } 
            else {
              console.log('Checkin added successfully');
              res.status(200).send('Checkin added successfully');
            }
        });
    });
    app.get('/checkinresponse', (req, res) => {
        const { date, userId } = req.query;
        console.log('Date: ' + date);
        console.log('user: ' + userId);
    
        console.log('retrieve items for date:', date, 'and user ID:', userId);

        // Construct the SQL query with parameters
        let sqlquery = "SELECT mood_rating FROM checkin WHERE checkin_date = ? AND user_id = ?";
        let newrecord = [date, userId];
    
        // Execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting check-in', err);
                res.status(500).send('Error getting check-in');
            } else {
                console.log('Check-in successfully received');
                console.log('check in data:' + result)

            // Convert result to an array of mood ratings
            const moodRatings = result.map(entry => entry.mood_rating);

            if (moodRatings.length === 0) {
                console.log('No check-in data found');
                res.json({ mood_rating: 0 }); // Return empty array for no check-in data
            } else {
                res.json({ mood_rating: moodRatings[0] });
            }
            }
        });
    });
    app.post('/postgoal', (req, res) => {
        console.log('post goal');
        const { goal, goal_target_date, userId } = req.body;
        let is_complete = 0;

        let sqlquery = "INSERT INTO goals (goal, is_complete, goal_target_date, user_id) VALUES (?, ?, ?, ?)";
        let newrecord = [goal, is_complete, goal_target_date, userId];

        console.log(is_complete);

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              console.log('Error adding goal:', err);
              res.status(500).send('Error adding goal');
            } 
            else {
              console.log('Goal added successfully');
              res.status(200).send('Goal added successfully');
            }
        });
    });
    app.get('/getgoals', (req, res) => {
        const { userId } = req.query;
        console.log('user: ' + userId);
    
        console.log('retrieve goals for user:', userId);
    
        // Construct the SQL query with parameters
        let sqlquery = "SELECT goal, is_complete, goal_target_date FROM goals WHERE user_id = ?";
        let newrecord = [userId];
    
        // Execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting goals', err);
                res.status(500).send('Error getting goals');
            } else {
                console.log('Goals successfully received');
                res.json({ items: result });
            }
        });
    });
}