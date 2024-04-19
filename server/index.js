const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const session = require('express-session');
var validator = require ('express-validator');

const app = express();
const port = 8000;

app.use(cors({
    origin: true, // Adjust according to your React app's origin
    credentials: true, // To allow cookies to be sent
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    withCredentials: true,
    cookie: {
        expires: 600000
    }
}));

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
      console.log('server listening on port 8000');
});