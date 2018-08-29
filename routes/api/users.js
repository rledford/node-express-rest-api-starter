const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const auth = require('../auth');

const User = mongoose.model('User');
const io = require('../../socket');

router.get('/users/list', function(req, res, next) {
  User.find({}, { username: 1, email: 1 })
    .then(function(users) {
      return res.json({ users: users || [] });
    })
    .catch(next);
});

router.get('/user', auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      console.log(user.toAuthJSON());
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

/**
 * updates the authenticated user, responds with the updated document,
 * and emits an 'update' event to the socket.io users namespace
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
        try {
          io.getInstance()
            .of(io.namespace.users)
            .emit('update', { user: user.toPublicJSON() });
        } catch (err) {
          console.log(`socket.io error ${err}`);
        }
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

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

router.post('/user', function(req, res, next) {
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

module.exports = router;
