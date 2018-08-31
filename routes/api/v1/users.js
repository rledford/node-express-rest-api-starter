const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const rateLimiter = require('express-rate-limit');
const User = mongoose.model('User');

const auth = require('../../auth');
const permit = require('../../permission');
const io = require('../../realtime');

/**
 * middleware
 *
 * limits the number of login requests a user can make
 */
loginLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  handler: function(req, res) {
    return res.status(429).json({
      errors: [
        {
          code: 429,
          location: 'client',
          message: 'Too many requests, please try again later'
        }
      ]
    });
  }
});

/**
 * middleware
 *
 * validates the request body has a "user" property of type "object" - this should
 * be used anytime a request is made to create or update a User in the database
 */
function checkBodyHasUser(req, res, next) {
  if (typeof req.body.user !== 'object') {
    return res.status(422).json({
      errors: [
        {
          code: 422,
          location: 'body',
          message:
            'The request body must contain a "user" property of type "object"',
          example: '{"user": {"field1": "value1", "field2": "value2"}}'
        }
      ]
    });
  }

  next();
}

/**
 * middleware
 *
 * validates that the requesting user can create or update a user with the roles
 * provided in request -> body -> user -> roles
 */
function checkRoleValues(req, res, next) {
  const user = req.body.user;
  if (
    Array.isArray(user.roles) &&
    req.payload.roles.indexOf('admin') === -1 &&
    user.roles.indexOf('admin') >= 0
  ) {
    return res.status(403).json({
      errors: [
        {
          code: 403,
          location: 'body',
          message:
            'Not permitted to create or update users with the provided roles'
        }
      ]
    });
  }

  next();
}

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
router.put('/user', auth.required, checkBodyHasUser, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        res.status(401).json({
          errors: [
            {
              code: 401,
              location: 'token',
              message:
                'The user associated with the provided token no longer exists'
            }
          ]
        });
        return res.sendStatus(401);
      }

      const { username, email, image, password } = req.body.user;

      if (typeof username !== 'undefined') {
        user.username = username;
      }
      if (typeof email !== 'undefined') {
        user.email = email;
      }
      if (typeof image !== 'undefined') {
        user.image = image;
      }
      if (typeof password !== 'undefined') {
        user.setPassword(password);
      }

      return user.save().then(function() {
        // socket.io emit is for demonstration only and should be removed
        try {
          io.getInstance()
            .of(io.namespace.users)
            .emit('update', { user: user.toPublicJSON() });
        } catch (err) {
          console.log(`socket.io error ${err}`);
        }
        return res.json({ user: user.toPublicJSON() });
      });
    })
    .catch(next);
});

/**
 * returns a list of users with support for simple pagination
 */
router.get('/users', auth.required, permit('admin', 'manager'), function(
  req,
  res,
  next
) {
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
 * creates a new user with the username, email, and password provided in the request body
 */
router.post(
  '/users',
  auth.required,
  permit('admin', 'manager'),
  checkBodyHasUser,
  checkRoleValues,
  function(req, res, next) {
    const user = new User();

    const { username, roles, email, password } = req.body.user;

    user.username = username;
    user.email = email;
    user.roles = roles;
    user.setPassword(password);

    user
      .save()
      .then(function() {
        return res.json({ user: user.toPublicJSON() });
      })
      .catch(next);
  }
);

/**
 * authenticates the credentials and returns some of the user data with a token
 */
router.post('/users/login', loginLimiter, checkBodyHasUser, function(
  req,
  res,
  next
) {
  const { username, email, password } = req.body.user;

  if (!username && !email) {
    return res.status(422).json({
      errors: [
        {
          code: 422,
          location: 'body',
          message: 'Username or email cannot be blank'
        }
      ]
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: [
        {
          code: 422,
          location: 'body',
          message: 'Password cannot be blank'
        }
      ]
    });
  }

  const strategy = username ? 'username' : 'email';

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
