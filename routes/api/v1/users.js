const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const auth = require('../../auth');

const User = mongoose.model('User');
const io = require('../../realtime');

/**
 * uses the request auth token to determine the current user and returns
 * the user data along with an updated token - this can be used to refresh tokens
 */
router.get('/user', auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

/**
 * uses the request auth token to determine the current user and updates the
 * user document with the provided request body data - responds with the updated
 * document, and emits an 'update' event to the socket.io users namespace
 */
router.put('/user', auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      if (typeof req.body.user.username !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== 'undefined') {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.image !== 'undefined') {
        user.image = req.body.user.image;
      }
      if (typeof req.body.user.password !== 'undefined') {
        user.setPassword(req.body.user.password);
      }

      return user.save().then(function() {
        if (process.env.NODE_ENV !== 'production') {
          try {
            io.getInstance()
              .of(io.namespace.users)
              .emit('update', { user: user.toPublicJSON() });
          } catch (err) {
            console.log(`socket.io error ${err}`);
          }
        }
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

/**
 * returns a list of users with support for simple pagination
 */
router.get('/users', auth.required, function(req, res, next) {
  let page = parseInt(req.query.page) || 0;
  page = page > 0 ? page - 1 : 0;

  let limit = parseInt(req.query.limit) || 25;
  limit = limit <= 100 ? limit : 100;

  User.find({}, { username: 1, email: 1 })
    .limit(limit)
    .skip((page > 0 ? page - 1 : 0) * limit)
    .exec()
    .then(function(users) {
      return res.json({ users: users || [] });
    })
    .catch(next);
});

/**
 * creates a new user with the username, email and password provided in the request body
 */
router.post('/users', auth.required, function(req, res, next) {
  const user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(function() {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

/**
 * authenticates the credentials and returns the user data with a token
 */
router.post('/users/login', function(req, res, next) {
  if (!req.body.user.username && !req.body.user.email) {
    return res
      .status(422)
      .json({ errors: { 'username or email': 'cannot be blank' } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: 'cannot be blank' } });
  }

  const strategy = req.body.user.username ? 'username' : 'email';

  passport.authenticate(strategy, { session: false }, function(
    err,
    user,
    info
  ) {
    if (err) {
      return next(err);
    }
    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;
