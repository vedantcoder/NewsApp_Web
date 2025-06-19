const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const pg = require('pg-promise')();
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

//setting up port
const PORT = 3000;

//creating app
const app = express();

//ssetting up pg-promise for PostgreSQL Database
const connection_string =  "postgres://postgres:vedant123@localhost:5432/newsdb";
const db = pg(connection_string);

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

//password encryption
const SALT_ROUNDS = 5;

//middleware to save username
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.username = req.session.user.username;
    res.locals.userid = req.session.user.userid;
  }
  next();
});


//routes
//registration
app.get('/register',(req,res) => {
    res.render('register');
});

app.post('/register', (req,res) => {

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
app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

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

//user articles
app.get('/:user/articles', (req,res) => {
    if(req.params.user===req.session.user.username){
        let userid = req.session.user.userid;
        const message = req.query.message;

        db.any('SELECT articleid, title, body FROM articles WHERE userid = $1', [userid])
        .then((articles) => {
            res.render('articles', {articles: articles, message:message});
        })
    }
    else   
        res.render('login', {message1: `Login to access ${req.params.user}'s articles`});
}) 

//add article
app.get('/:user/add-article', (req,res) => {
    res.render('add-article');
})
app.post('/:user/add-article', (req,res) =>{
    let title = req.body.title;
    let description = req.body.description;
    let userid = req.session.user.userid;

    db.none('INSERT INTO articles (title, body, userid) VALUES ($1, $2, $3)', [title, description, userid])
    .then(() => {
        res.send("SUCCESS");
    });
})

//update article
app.get('/:user/articles/edit/:articleid', (req,res) => {
    let articleid = req.params.articleid;

    db.one('SELECT articleid, title, body FROM articles WHERE articleid = $1', [articleid])
    .then((article) => {
        res.render('edit-article', article);
    })
})
app.post('/:user/update-article', (req,res) => {
    let title = req.body.title;
    let body = req.body.description;
    let articleid = req.body.articleid;

    db.none('UPDATE articles SET title = $1, body = $2 WHERE articleid = $3', [title, body, articleid])
    .then(() => {
        res.redirect(`/${req.session.user.username}/articles?message=Article+updated`);
    })
})

//delete article
app.post('/:user/delete-article', (req,res) => {
    let articleid = req.body.articleid;

    db.none('DELETE FROM articles WHERE articleid = $1', [articleid])
    .then(() => {
        res.redirect(`/${req.session.user.username}/articles?message=Article+deleted`);
    })
})

//home
app.get('/', (req,res) => {
    db.any('SELECT articleid, title, body FROM articles')
    .then((articles) => {
    if(req.session.user)    
        res.render('index', {articles: articles})
    else
        res.render('index', {articles: articles, message: "Login to add articles"})
    })
})

app.listen(PORT,() => {
    console.log(`Server has started on ${PORT}`);
});