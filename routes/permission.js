const _ = require('underscore');

function permit(...allowed) {
  return (req, res, next) => {
    if (
      req.payload.roles &&
      _.intersection(allowed, req.payload.roles).length > 0
    ) {
      return next();
    }

    res.status(403).json({
      errors: {
        user:
          'not permitted to access or perform the requested resource or action'
      }
    });
  };
}

module.exports = permit;
