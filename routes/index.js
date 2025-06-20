const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pg = require('pg-promise')();
const bodyParser = require('body-parser');

//setting up pg-promise for PostgreSQL Database
// Use environment variable for the connection string
const connection_string = process.env.DATABASE_URL;
const db = pg(connection_string);

//bodyparser
router.use(bodyParser.urlencoded({extended: false}));

//password encryption
const SALT_ROUNDS = 5;

//registration
router.get('/register',(req,res) => {
    res.render('register');
});

router.post('/register', (req,res) => {

    let username = req.body.username;
    let password = req.body.password;

    db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
    .then((user) => {
        if(user){
            res.render('register', {message: 'Username already exists!'});  //checking if username exists
        }
        else{
            //else insert user in db table
            bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
                if(error==null){
                    db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash])
                    .then(() => {
                        res.send("SUCCESS"); //fix this later
                    });
                }
            });
        }
    });
});

//login route
router.get('/login', (req,res) => {
    res.render('login');
})

router.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    const message = req.query.message;

    db.oneOrNone('SELECT userid, username, password FROM users where username = $1', [username])
    .then((user) => {
        if(user){
            bcrypt.compare(password, user.password, (error, result) => {
                if(result){
                    if(req.session){
                        req.session.user = {userid: user.userid, username: user.username};
                        res.redirect(`/${req.session.user.username}/articles`);
                    }
                }
                else{
                    res.render('login', {message1: `Invalid Password for User- ${username}`});                                    
                }
            })
        }
        else{
            res.render('login', {message2: "Username does not exist"});
        }
    })
})

//home
router.get('/', (req,res) => {
    db.any('SELECT articleid, title, body FROM articles')
    .then((articles) => {
    if(req.session.user)    
        res.render('index', {articles: articles})
    else
        res.render('index', {articles: articles, message: "Login to add articles"})
    })
})

//logout
router.get('/logout', (req,res,next) => {
    if(req.session.user){
        req.session.destroy((error) => {
            if(error){
                next(error);
            }
            else{
                res.redirect('/login');
            }
        })
    }
})

//hello - (test)
router.get('/hello', (req,res,next) => {
    res.send("Hello World");
})

module.exports = router;