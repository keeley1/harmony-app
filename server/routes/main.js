const { check, validationResult } = require('express-validator'); 
module.exports = function(app) {
    // import needed dependencies
    const mysql = require('mysql');
    const bcrypt = require('bcrypt');

    const requireAuth = (req, res, next) => {
        if (!req.session.userId) {
          res.redirect('/login'); // Redirect to login page if user not authenticated
        } else {
          next(); // Proceed to the next middleware or route handler
        }
      };
    
    app.post('/register',
        [
            // validate each field against specific criteria
            check('firstname').matches(/^[a-zA-Z]+$/).withMessage('First name is required'),
            check('lastname').matches(/^[a-zA-Z]+$/).withMessage('Last name is required'),
            check('username').notEmpty().withMessage('Username is required').isLength({ max: 15 }).withMessage('Username must be shorter than 15 characters'),
            check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
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
    app.post('/login', (req, res) => {
        let sqlquery = "SELECT * FROM user_details WHERE username = ? AND hashedPassword = ?";
        let newrecord = [req.body.username, req.body.password];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error logging in', err);
                res.status(500).send('Error logging in');
            } 
            if (result.length > 0) {
                console.log('logged in');
                console.log(result);
                res.send(result);
            } else {
                console.log(result);
                res.send({message: "Username and password do not match"});
            }
            /*else {
                console.log('User registered successfully');
                res.status(200).send('User registered successfully');
            }*/
        });
    });
    app.get('/getitems', (req, res) => {
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
        console.log(req.body);
      
        let sqlquery = "INSERT INTO daily_tasks (task) VALUES (?)";
        let newrecord = req.body.text;

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
        // handle date format
        // check database
        res.status(200).send(`Current date: ${currentDate}`);
    });
    app.get('/test', (req, res) => {
        console.log('test route');
        res.redirect('/login');
    });
}