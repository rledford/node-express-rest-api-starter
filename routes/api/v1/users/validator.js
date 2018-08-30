/**
 * validate.js
 *
 * validates a request's query and/or body for different user operations
 */

module.exports = {
  body: {
    /**
     * ensures the request has a user object in the body and the requesting user
     * does not attempt to create a user with admin role if they are not an admin
     */
    create: function(req, res, next) {
      if (typeof req.body.user !== 'object') {
        return res.status(422).json({
          errors: { 'request body': 'missing user object' }
        });
      }

      if (
        Array.isArray(req.body.user.roles) &&
        req.payload.roles.indexOf('admin') === -1 &&
        req.body.user.roles.indexOf('admin') >= 0
      ) {
        return res.status(403).json({
          errors: {
            user: 'not permitted to create other users with the provided roles'
          }
        });
      }

      next();
    },
    updateSelf: function(req, res, next) {
      if (typeof req.body.user !== 'object') {
        return res.status(422).json({
          errors: { 'request body': 'missing user object' }
        });
      }

      next();
    },
    updateOther: function(req, res, next) {
      if (typeof req.body.user !== 'object') {
        return res.status(422).json({
          errors: { 'request body': 'missing user object' }
        });
      }

      next();
    }
  }
};
