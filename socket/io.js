/**
 * io.js
 *
 * Creates a socket.io server, configures it with authentication middleware, loads the other modules (i.e. users.js),
 * and exports functions to access the server instance and namespace names in other modules
 */

const auth = require('../routes/auth');
const namespace = {
  users: '/users'
};

let io = null;

module.exports = {
  init: function(server) {
    if (io) return;
    io = require('socket.io')(server);
    io.use(function(socket, next) {
      console.log('authenticating socket.io connection request');
      auth.socketio(socket, null, err => {
        if (err) {
          console.log(`socket.io authentication failed - ${err}`);
        }

        next(err);
      });
    });

    require('./users'); // creates the /ws/users namespace
  },
  getInstance: function() {
    return io;
  },
  namespace
};
