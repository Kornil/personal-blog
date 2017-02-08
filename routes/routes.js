var passport = require('passport');
var Article = require('../models/article');

module.exports = function(app) {

    app.use(require('body-parser').urlencoded({ extended: true }));

    app.get('/',
    function(req, res) {
        res.render('index', { user: req.user });
    });

    app.get('/login/google',
    passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ] }));

    app.get('/login/google/return', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
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
    var newArticle = new Article({
        title: req.body.title,
        text: req.body.text,
        author: req.user._id,
        date: Date.now()
    })
    newArticle.save()
        .then(function(){
            res.redirect('/');
        })
  });

}