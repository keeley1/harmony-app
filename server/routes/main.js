module.exports = function(app) {
    const mysql = require('mysql');
    
    app.post('/register', (req, res) => {
        let sqlquery = "INSERT INTO user_details (firstname, surname, email, username, hashedPassword) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.firstname, req.body.lastname, req.body.email, req.body.username, req.body.password];

        console.log(req.body.firstname + " " + req.body.lastname + " " + req.body.email + req.body.username + " " + req.body.password);

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                console.log('Error registering user', err);
                res.status(500).send('Error registering user');
            } 
            else {
                console.log('User registered successfully');
                res.status(200).send('User registered successfully');
            }
        });
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
                res.send(result);
            } else {
                res.send({message: "Wrong username/password combination!"});
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
}