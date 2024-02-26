const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection ({
      host: 'localhost',
      user: 'appuser',
      password: 'harmony',
      database: 'harmonyApp'
  });
  
  // connect to the database
  db.connect((err) => {
      if (err) {
          throw err;
      }
      console.log('connected to harmony database');
  });
  global.db = db; 

require('./routes/main')(app);

app.listen(port, () => {
      console.log('server listening on port 8080');
});