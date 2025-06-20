//middleware

function checkAuth(req,res,next){
    if(req.session.user){
        next();
    }
    else{
        res.render('login', {message: "Login"});
    }
}

module.exports = checkAuth;