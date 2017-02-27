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
    
    app.get('/logout/return', function(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });

    app.get('/login/google',
    passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ] }));

    app.get('/login/google/return', 
    passport.authenticate('google', { successReturnToOrRedirect: '/', failureRedirect: '/login/google' }));

    app.post('/update/:id', function(req, res){
        Article.findByIdAndUpdate(req.params.id, { $set: {
            text: req.body.text,
            tags: req.body.tags
        } } ).exec()
            .then(function(article){
                res.redirect('back');
            })
    })

    app.post('/comment/:id', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
        Article.findByIdAndUpdate(req.params.id, { $push: { comments: {
            text: req.body.newComment,
            author: req.user.username,
            date: moment().format('MMMM Do YYYY'),
            likes: 0,
            likedBy: []
        } } }).exec()
            .then(function(){
                res.redirect('back');
            })
    });

  app.post('/newArticle/return', function(req, res){
    if (req.user.admin) {
    var newArticle = new Article({
        title: req.body.title,
        heading: req.body.heading,
        image: req.body.image,
        text: req.body.text,
        author: req.user.username,
        date: moment().format('MMMM Do YYYY'),
        comments: [],
        likes: 0,
        likedBy: []
    })
    newArticle.save()
        .then(function(){
            res.redirect('/');
        })
    } else {
        res.redirect('/')
    }
  });

  app.post('/like/:id', function(req, res){

    Article.findById(req.params.id).exec()
        .then(function(article){

            if(!article.likedBy.includes(req.user.username)) {
                Article.findByIdAndUpdate(req.params.id, {$inc: { likes: 1}, $push: { likedBy: req.user.username } }).exec()
                    .then(function(){
                        res.redirect('back');
                    })
            }else{
                Article.findByIdAndUpdate(req.params.id, {$inc: { likes: -1}, $pull: { likedBy: req.user.username } }).exec()
                    .then(function(){
                        res.redirect('back');
                    })
            }

        });
        
  });

  app.get('/register/newAuthor', function(req, res){
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
            res.redirect('/');
        })
  });

  app.get('/:author', function(req, res){
        var authorFixed = req.params.author.replace(/_/g," ");
        User.findOne({username: authorFixed}).exec()
            .then(function(author){
                if(!author)
                    res.send(authorFixed +" is not a registered user");
                else{
                    Article.find({author: author.username}).exec()
                        .then(function(articles){
                            res.render('author', { user: req.user, author: author, articles: articles });
                        })
                }           
            })
    });

    app.get('/:author/:title', function(req, res){
        var authorFixed = req.params.author.replace(/_/g," ");
        var titleFixed = req.params.title.replace(/_/g," ");
        Article.findOne({author: authorFixed, title: titleFixed}).exec()
            .then(function(article){
                res.render('article', { user: req.user, article: article });
            })
    });

}