const jwt = require('express-jwt');
const secret = require('../config').secret;

function getTokenFromHeader(req) {
  if (req.headers.authorization) {
    const auth = req.headers.authorization.split(' ');
    if (auth[0] === 'Token' || auth[0] === 'Bearer') {
      return auth[1];
    }
  }

  return null;
}

const auth = {
  required: jwt({
    secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
