var passport = require('passport');

module.exports = function(app) {

    app.use(require('body-parser').urlencoded({ extended: true }));

    app.get('/',
    function(req, res) {
        res.render('index', { user: req.user });
    });

    app.get('/login',
    function(req, res){
        res.render('login');
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

}