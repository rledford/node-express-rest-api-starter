const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
  'email',
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    function(email, password, done) {
      User.findOne({ email })
        .then(function(user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { 'email or password': 'is invalid' }
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

passport.use(
  'username',
  new LocalStrategy(
    {
      usernameField: 'user[username]',
      passwordField: 'user[password]'
    },
    function(username, password, done) {
      User.findOne({ username })
        .then(function(user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { 'username or password': 'is invalid' }
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
