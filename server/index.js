const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const session = require('express-session');
var validator = require ('express-validator');
const path = require('path');

const app = express();
const port = 8000;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));

/*
app.use(cors({
    origin: true, 
    credentials: true, 
}));*/

app.use(express.json());

//app.use(express.static(path.join(__dirname, 'build')));

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    withCredentials: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000
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