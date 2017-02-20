var passport = require('passport');
var Article = require('../models/article');
var User = require('../models/user');

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

    app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.post('/newArticle', function(req, res){
    if (req.user.admin) {
    var newArticle = new Article({
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image,
        text: req.body.text,
        author: req.user._id,
        date: Date.now()
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