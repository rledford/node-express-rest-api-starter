/**
 * users.js
 *
 * Creates the socket.io io.namespace.users namespace
 */

const io = require('./io');
const server = io.getInstance();

const users = server.of(io.namespace.users);

users.on('connection', function(socket) {
  console.log(
    `client connected to socket.io namespace [ ${io.namespace.users} ]`
  );
});

users.on('disconnect', function() {
  console.log(
    `client disconnected from socket.io namespace [ ${io.namespace.users} ]`
  );
});

module.exports = users;
