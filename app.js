require('dotenv').config(); // load .env values
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const pg = require('pg-promise')();
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const checkAuth = require('./utils/checkAuth');

//setting up port
const PORT = process.env.PORT || 3000;

//creating app
const app = express();

//setting up pg-promise for PostgreSQL Database
// Use environment variable for the connection string
const connection_string = process.env.DATABASE_URL;
db = pg(connection_string);

//configuring view engine
const VIEWS_PATH = path.join(__dirname, '/views')
app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials', '.mustache'));
app.set('views', VIEWS_PATH);
app.set('view engine','mustache');

//static folder
app.use('/css', express.static('css'));

//creating session (middleware)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

//bodyparser
app.use(bodyParser.urlencoded({extended: false}));

//middleware to save username
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.username = req.session.user.username;
    res.locals.userid = req.session.user.userid;
  }
  next();
});

//middleware for routes
app.use('/', userRoutes);
app.use('/', indexRoutes);

//routes -- shifted to routes folder

app.listen(PORT,() => {
    console.log(`Server has started on ${PORT}`);
});