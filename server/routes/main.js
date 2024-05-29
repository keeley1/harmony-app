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
            // log any validation errors 
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
                    res.send('Username does not exist');
                } 
                else {
                    const hashedPassword = result[0].hashedPassword; 
    
                    bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
                        if (err) {
                            // return error to user
                            res.send('Cannot find user');
                        } 
                        else if (result === true) {
                            // save user session here, when login is successful 
                            req.session.userId = req.body.username; 
                            console.log('logged in');
                            res.send(result);
                        } 
                        else {
                            res.send('Cannot find user');
                        }
                    });
                }
            }
        }); 
    });
    app.get('/logout', (req, res) => {
        // destroy current session
        req.session.destroy(err => {
            if (err) {
                return console.error(err.message);
            }
            console.log('logged out');
            res.json({ loggedIn: false });
        });
    });
    app.get('/auth', (req, res) => {
        if (req.session.userId) {
            // user is logged in
            res.json({ loggedIn: true, userId: req.session.userId });
        } 
        else {
            // user is not logged in
            res.json({ loggedIn: false });
        }
    });
    app.post('/additem', [
        // validate each field against specific criteria
        check('text').notEmpty().withMessage('Please enter a task').isLength({ max: 500 }).withMessage('Task is too long')
    ],
    (req, res) => {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log any validation errors 
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        } 
        else {
            // extract the task text, date, and userId from the request body
            const { text, date, userId } = req.body;
            let isComplete = 0;

            let sqlquery = "INSERT INTO daily_tasks (task, task_date, is_complete, user_id) VALUES (?, ?, ?, ?)";
            let newrecord = [text, date, isComplete, userId];
        
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
        }
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
    app.post('/completeitem', (req, res) => {
        const { taskId, isComplete, userId } = req.body;
    
        let sqlQuery = "UPDATE daily_tasks SET is_complete = ? WHERE task_id = ? AND user_id = ?";
        let values = [isComplete, taskId, userId];
    
        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.log('Error updating task:', err);
                res.status(500).send('Error updating task');
            } 
            else {
                console.log('Task updated successfully');
                res.status(200).send('Task updated successfully');
            }
        });
    });
    app.get('/getdate', (req, res) => {
        let currentDate = new Date();
    
        // extract date components
        let dayOfWeek = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
        let date = currentDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        let time = currentDate.toLocaleTimeString('en-GB');
    
        // create a JSON object with the date components
        let dateInfo = {
            dayOfWeek: dayOfWeek,
            date: date,
            time: time
        };
    
        res.status(200).json(dateInfo);
    });      
    app.get('/retrieveitems', (req, res) => {
        // get the date and userID from query parameters
        const { date, userId } = req.query;
    
        // construct the SQL query with parameters
        let sqlquery = "SELECT task, task_id, is_complete FROM daily_tasks WHERE task_date = ? AND user_id = ?";
        let newrecord = [date, userId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
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
    app.post('/savegratitude', [
        // validate each field against specific criteria
        check('text').notEmpty().withMessage('Please enter your daily gratitude').isLength({ max: 500 }).withMessage('Gratitude is too long')
    ], 
    (req, res) => {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log any validation errors 
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        } 
        else {
            const { text, date, userId } = req.body;

            let sqlquery = "INSERT INTO gratitude (item, gratitude_date, user_id) VALUES (?, ?, ?)";
            let newrecord = [text, date, userId];
        
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
        }
    });
    app.get('/getgratitude', (req, res) => {
        const { date, userId } = req.query;

        // construct the SQL query with parameters
        let sqlquery = "SELECT item, gratitude_id FROM gratitude WHERE gratitude_date = ? AND user_id = ?";
        let newrecord = [date, userId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
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
    app.post('/postcheckin', (req, res) => {
        const { mood_rating, date, emotion_one, emotion_two, emotion_three, userId } = req.body;

        let sqlquery = "INSERT INTO checkin (mood_rating, checkin_date, emotion_one, emotion_two, emotion_three, user_id) VALUES (?, ?, ?, ?, ?, ?)";
        let newrecord = [mood_rating, date, emotion_one, emotion_two, emotion_three, userId];

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

        // construct the SQL query with parameters
        let sqlquery = "SELECT mood_rating FROM checkin WHERE checkin_date = ? AND user_id = ?";
        let newrecord = [date, userId];
    
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting check-in', err);
                res.status(500).send('Error getting check-in');
            } 
            else {
                console.log('Check-in successfully received');
                console.log('check in data:' + result)
                
                // convert result to an array of mood ratings
                const moodRatings = result.map(entry => entry.mood_rating);

                if (moodRatings.length === 0) {
                    console.log('No check-in data found');
                    res.json({ mood_rating: 0 });
                } 
                else {
                    res.json({ mood_rating: moodRatings[0] });
                }
            }
        });
    });
    app.post('/postgoal', [
        // validate each field against specific criteria
        check('goal').notEmpty().withMessage('Please enter your goal').isLength({ max: 500 }).withMessage('Gratitude is too long'),
        check('goal_target_date').notEmpty().withMessage('Please enter a target date').isDate().withMessage('Please enter a valid date')
    ], 
    (req, res) => {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log any validation errors 
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            const { goal, goal_target_date, userId } = req.body;
            let is_complete = 0;

            let sqlquery = "INSERT INTO goals (goal, is_complete, goal_target_date, user_id) VALUES (?, ?, ?, ?)";
            let newrecord = [sanitise(goal), is_complete, goal_target_date, userId];

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
        }
    });
    app.get('/getgoals', (req, res) => {
        const { userId } = req.query;
        
        // construct the SQL query with parameters
        let sqlquery = "SELECT goal_id, goal, is_complete, goal_target_date FROM goals WHERE user_id = ?";
        let newrecord = [userId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting goals', err);
                res.status(500).send('Error getting goals');
            } 
            else {
                console.log('Goals successfully received');
                res.json({ items: result });
            }
        });
    });
    app.post('/completegoal', (req, res) => {
        const { goalId, isComplete, userId } = req.body;
    
        let sqlQuery = "UPDATE goals SET is_complete = ? WHERE goal_id = ? AND user_id = ?";
        let values = [isComplete, goalId, userId];
    
        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.log('Error updating goal:', err);
                res.status(500).send('Error updating goal');
            } 
            else {
                console.log('Goal updated successfully');
                res.status(200).send('Goal updated successfully');
            }
        });
    });
    app.post('/addgoaltask', (req, res) => {
        const { goalId, goal_task, userId } = req.body;

        // initialise is_complete to 0
        let is_complete = 0;

        let sqlquery = "INSERT INTO goal_tasks (goal_task, is_complete, user_id, goal_id) VALUES (?, ?, ?, ?)";
        let newrecord = [goal_task, is_complete, userId, goalId];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              console.log('Error adding task:', err);
              res.status(500).send('Error adding task');
            } 
            else {
              console.log('Task added successfully');
              res.status(200).send('Task added successfully');
            }
        });
    });
    app.get('/getgoaltasks', (req, res) => {
        const { goalId, userId } = req.query;
    
        // construct the SQL query with parameters
        let sqlquery = "SELECT goal_id, goal_task_id, goal_task, is_complete FROM goal_tasks WHERE goal_id = ? AND user_id = ?";
        let newrecord = [goalId, userId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting goal tasks', err);
                res.status(500).send('Error getting goal tasks');
            } 
            else {
                console.log('Goal tasks successfully received');
                res.json({ tasks: result });
            }
        });
    });
    app.post('/completegoaltask', (req, res) => {
        const { goalId, goalTaskId, isComplete, userId } = req.body;
    
        let sqlQuery = "UPDATE goal_tasks SET is_complete = ? WHERE goal_id = ? AND goal_task_id = ? AND user_id = ?";
        let values = [isComplete, goalId, goalTaskId, userId];
    
        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.log('Error updating goal:', err);
                res.status(500).send('Error updating goal');
            } 
            else {
                console.log('Goal updated successfully');
                res.status(200).send('Goal updated successfully');
            }
        });
    });
    app.post('/postproject', [
        // validate each field against specific criteria
        check('project_name').notEmpty().withMessage('Please enter your project').isLength({ max: 500 }).withMessage('Project name is too long'),
        check('project_description').notEmpty().withMessage('Please enter your project description').isLength({ max: 1000 }).withMessage('Project description is too long')
    ], 
    (req, res) => {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log any validation errors 
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            const { project_name, project_description, userId } = req.body;

            let sqlquery = "INSERT INTO projects (project_name, project_description, user_id) VALUES (?, ?, ?)";
            let newrecord = [project_name, project_description, userId];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                console.log('Error adding project:', err);
                res.status(500).send('Error adding project');
                } 
                else {
                console.log('Project added successfully');
                res.status(200).send('Project added successfully');
                }
            });
        }
    });
    app.get('/getprojects', (req, res) => {
        const { userId } = req.query;
    
        // construct the SQL query with parameters
        let sqlquery = "SELECT project_id, project_name, project_description FROM projects WHERE user_id = ?";
        let newrecord = [userId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting projects', err);
                res.status(500).send('Error getting projects');
            } 
            else {
                console.log('Projects successfully received');
                res.json({ items: result });
            }
        });
    });
    app.get('/getproject', (req, res) => {
        const { userId, projectId } = req.query;
    
        // construct the SQL query with parameters
        let sqlquery = "SELECT project_id, project_name, project_description FROM projects WHERE user_id = ? AND project_id = ?";
        let newrecord = [userId, projectId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting project', err);
                res.status(500).send('Error getting project');
            } 
            else {
                console.log('Project successfully received');
                res.json({ items: result });
            }
        });
    });
    app.get('/getprojectlists', (req, res) => {
        const { projectId } = req.query;
    
        // construct the SQL query with parameters
        let sqlquery = "SELECT project_list_id, project_list_name FROM project_lists WHERE project_id = ?";
        let newrecord = [projectId];
    
        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting project lists', err);
                res.status(500).send('Error getting project lists');
            } 
            else {
                console.log('Project lists successfully received');
                res.json({ items: result });
            }
        });
    });
    app.post('/addprojectlist', (req, res) => {
        const { project_list_name, project_id } = req.body;
        
        let sqlquery = "INSERT INTO project_lists (project_list_name, project_id) VALUES (?, ?)";
        let values = [project_list_name, project_id];
        
        db.query(sqlquery, values, (err, result) => {
            if (err) {
                console.log('Error adding project list', err);
                res.status(500).send('Error adding project list');
            } 
            else {
                console.log('Project list added successfully');
                res.status(201).send('Project list added successfully');
            }
        });
    });
    app.post('/deleteprojectlist', (req, res) => {
        const { projectListId } = req.body;

        let sqlquery = "DELETE FROM project_lists WHERE project_list_id = ?";
        let values = [projectListId];

        db.query(sqlquery, values, (err, result) => {
            if (err) {
                console.log('Error deleting project list', err);
                res.status(500).send('Error deleting project list');
            } 
            else {
                console.log('Project list deleted successfully');
                res.status(201).send('Project list deleted successfully');
            }
        });
    });
    app.get('/getprojecttasks', (req, res) => {
        const { projectListId } = req.query;

        // construct the SQL query with parameters
        let sqlquery = "SELECT project_task_id, project_task_name, project_task_description, project_task_due_date, project_task_is_complete FROM project_list_tasks WHERE project_list_id = ?";
        let newrecord = [projectListId];

        // execute the SQL query with parameters
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error getting project lists', err);
                res.status(500).send('Error getting project lists');
            } 
            else {
                console.log('Project lists successfully received');
                res.json({ items: result });
            }
        });
    });
    app.post('/addprojecttask', (req, res) => {
        const { projectTaskName, projectTaskDescription, projectTaskDate, projectListId } = req.body;
        const isComplete = 0;

        let sqlquery = "INSERT INTO project_list_tasks (project_task_name, project_task_description, project_task_due_date, project_task_is_complete, project_list_id) VALUES (?, ?, ?, ?, ?)";
        let values = [projectTaskName, projectTaskDescription, projectTaskDate, isComplete, projectListId];

        db.query(sqlquery, values, (err, result) => {
            if (err) {
                console.log('Error adding project task', err);
                res.status(500).send('Error adding project task');
            } 
            else {
                console.log('Project task added successfully');
                res.status(201).send('Project task added successfully');
            }
        });
    });
    app.post('/deleteprojecttask', (req, res) => {
        const { projectTaskId } = req.body;

        let sqlquery = "DELETE FROM project_list_tasks WHERE project_task_id = ?";
        let values = [projectTaskId];

        db.query(sqlquery, values, (err, result) => {
            if (err) {
                console.log('Error deleting project task', err);
                res.status(500).send('Error deleting project task');
            } 
            else {
                console.log('Project task deleted successfully');
                res.status(200).send('Project task deleted successfully');
            }
        });
    });
    app.post('/completeprojecttask', (req, res) => {
        const { isComplete, projectTaskId } = req.body;

        let sqlquery = "UPDATE project_list_tasks SET project_task_is_complete = ? WHERE project_task_id = ?";
        let values = [isComplete, projectTaskId];

        db.query(sqlquery, values, (err, result) => {
            if (err) {
                console.log('Error updating project task', err);
                res.status(500).send('Error updating project task');
            } 
            else {
                console.log('Project task updated successfully');
                res.status(200).send('Project task updated successfully');
            }
        });
    });
}