module.exports = function(app) {
    const mysql = require('mysql');
    
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