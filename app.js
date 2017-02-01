var express = require('express');
var passport = require('passport');
var routes = require('./routes/routes');
var mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./models/user')

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://kornil-blog.herokuapp.com/login/google/return'
  },
  function(accessToken, refreshToken, profile, done) {

    process.nextTick(function(){
      User.findOne({ 'google.id' : profile.id }).exec()
        .then(function(user){
          if(user)
            return done(null, user);
          else{
            //console.log(profile);
            var newUser = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              picture: profile.image.url,
              google: {
                id: profile.id,
                token: accessToken                
              }
            });
            newUser.save()
              .then(function(newUser){
                return done(null, newUser);
              })
          }
        }).catch(function(err){
          throw err;
        });
    })
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Google profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var app = express();
var port = process.env.PORT || 3000;

// Configure view engine to render EJS templates.
app.use('/assets', express.static(__dirname + '/assets'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session. 
app.use(passport.initialize());
app.use(passport.session());

routes(app);

app.listen(port);
