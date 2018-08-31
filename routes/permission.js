const _ = require('underscore');

/**
 * middleware
 * checks if the authenticated user is permitted to access the requested
 * resource based on the roles passed in the fn args
 * @param  {...any} allowed
 */
function permit(...allowed) {
  return (req, res, next) => {
    if (
      req.payload.roles &&
      _.intersection(allowed, req.payload.roles).length > 0
    ) {
      return next();
    }

    res.status(403).json({
      errors: [
        {
          code: 403,
          location: 'user',
          message: 'not permitted to access requested resource'
        }
      ]
    });
  };
}

module.exports = permit;
