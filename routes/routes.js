var passport = require('passport');
var Article = require('../models/article');
var User = require('../models/user');
var moment = require('moment')

module.exports = function(app) {

    app.use(require('body-parser').urlencoded({ extended: true }));

    app.get('/', function(req, res) {
        Article.find({}).exec()
            .then(function(articles){
                res.render('index', { user: req.user, articles: articles });
            })        
    });

    app.get('/login/google',
    passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ] }));

    app.get('/login/google/return', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

    app.get('/article/:id', function(req, res){
        Article.findById(req.params.id).exec()
            .then(function(article){
                res.render('article', { user: req.user, article: article });
            })
    });

    app.get('/:author',
    //require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        var authorFixed = req.params.author.replace(/_/g," ");
        User.findOne({username: authorFixed}).exec()
            .then(function(author){
                if(!author.length)
                    res.send("this user is not registered");
                else                
                    res.render('author', { user: req.user, author: author });
            })
    });

    app.get('/logout/return', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.post('/newArticle/return', function(req, res){
    if (req.user.admin) {
    var newArticle = new Article({
        title: req.body.title,
        image: req.body.image,
        text: req.body.text,
        author: req.user.username,
        date: moment().format('MMMM Do YYYY')
    })
    newArticle.save()
        .then(function(){
            res.redirect('/');
        })
    } else {
        res.redirect('/')
    }
  });

  app.get('/register/'+process.env.SECRET_LINK, function(req, res){
    var profile = req.user;
    var newUser = new User ({
        username: profile.username,
        email: profile.email,
        picture: profile.picture,
        admin: true,
        google: {
            id: profile.google.id,
            token: profile.google.token                
        }
    });
    newUser.save()
        .then(function(){
            req.logout();
            res.redirect('/');
        })
  });

}