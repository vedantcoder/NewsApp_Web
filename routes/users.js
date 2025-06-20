const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

//bodyparser
router.use(bodyParser.urlencoded({extended: false}));

//user articles
router.get('/:user/articles', (req,res) => {
    if(req.session.user){
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
    }
    else{
        res.redirect('/login');
    }
}) 

//add article
router.get('/:user/add-article', (req,res) => {
    if(req.session.user.username)
        res.render('add-article');
    else
        res.redirect('/login');
})
router.post('/:user/add-article', (req,res) =>{
    let title = req.body.title;
    let description = req.body.description;
    let userid = req.session.user.userid;

    db.none('INSERT INTO articles (title, body, userid) VALUES ($1, $2, $3)', [title, description, userid])
    .then(() => {
        res.redirect(`/${req.session.user.username}/articles?message=Article+Added`);
    });
})

//update article
router.get('/:user/articles/edit/:articleid', (req,res) => {
    let articleid = req.params.articleid;

    db.one('SELECT articleid, title, body FROM articles WHERE articleid = $1', [articleid])
    .then((article) => {
        res.render('edit-article', article);
    })
})
router.post('/:user/update-article', (req,res) => {
    let title = req.body.title;
    let body = req.body.description;
    let articleid = req.body.articleid;

    db.none('UPDATE articles SET title = $1, body = $2 WHERE articleid = $3', [title, body, articleid])
    .then(() => {
        res.redirect(`/${req.session.user.username}/articles?message=Article+updated`);
    })
})

//delete article
router.post('/:user/delete-article', (req,res) => {
    let articleid = req.body.articleid;

    db.none('DELETE FROM articles WHERE articleid = $1', [articleid])
    .then(() => {
        res.redirect(`/${req.session.user.username}/articles?message=Article+deleted`);
    })
})

module.exports = router;