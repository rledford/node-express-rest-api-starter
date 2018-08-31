<h4>NodeJS, Express, and socket.io REST API Starter</h4>
<p>
This starter provides the basic files, folders, and npm packages for building a simple REST API. Only the user model and routes are implemented, but the code in these files can be used as reference when adding new models, routes, middleware, etc. I referenced <a href='https://github.com/gothinkster/node-express-realworld-example-app' target='_blank'>this project by gothinkster</a> to get started as the code seems to abide by many of the best practices and the file/folder structure makes sense (to me). I looked through a lot of REST API boilerplates and didn't really like the way many of the projects were setup. I had also been testing a lot of frameworks like <a href='https://loopback.io' target='_blank'>LoopBack</a> and <a href='https://sailsjs.com' target='_blank'>SailsJS</a>, but in the end I just wanted more control and less magic.
</p>
<h4>Goals</h4>
<ul>
  <li>To have an easy-to-follow file/folder structure</li>
  <li>To provide comments that explain what's going on</li>
  <li>To have basic CRUD operations for the user model</li>
  <li>To implement a basic authentication and JWT system</li>
  <li>To have realtime capabilities using socket.io</li>
  <li>To secure the realtime connection requests with the JWT system</li>
  <li>To automate API testing with <a href='https://mochajs.org/' target='_blank'>MochaJS</a> and <a href='www.chaijs.com' target='_blank'>ChaiJS</a></li>
  <li>To use HTTPS (this is not implemented yet)</li>
</ul>
<h4>See How</h4>
<ul>
  <li>To wire up an Express app</li>
  <li>To implement a login system using Passport local strategies</li>
  <li>To use middleware to simplify the code within the routes</li>
  <li>To protect API routes using middleware</li>
  <li>To restrict authenticated user requests based on their roles using middleware</li>
  <li>To create socket.io namespaces that require users to be authenticated to join</li>
  <li>To use socket.io to send events to connected clients when the database updates a document</li>
  <li>To implement methods and statics for a Mongoose schema</li>
  <li>To respond to requests with helpful error messages</li>
  <li>To automate API testing with MochaJS and ChaiJS</li>
</ul>
<h4>Using</h4>
<ul>
  <li><a href='https://www.npmjs.com/package/body-parser' target='_blank'>body-parser</a> - parse the request body and makes it available under the req.body property</li>
  <li><a href='https://www.npmjs.com/package/cors' target='_blank'>cors</a> - allow cross origin requests to access the API</li>
  <li><a href='https://www.npmjs.com/package/errorhandler' target='_blank'>errorhandler</a> - used ONLY during development for more detailed error messages to be sent back to the client
  <li><a href='https://www.npmjs.com/package/express' target='_blank'>express</a> - web application framework</li>
  <li><a href='https://www.npmjs.com/package/express-jwt' target='_blank'>express-jwt</a> - middleware to read JWTs and add the claims to the request payload</li>
  <li><a href='https://www.npmjs.com/package/express-session' target='_blank'>express-session</a> - session middleware for storing relevant user information - uses the default MemoryStore and should be replaced with something like <a href='https://npmjs.com/package/connect-mongo' target='_blank'>connect-mongo</a> to persist data instead of the default store which is prone to memory leaks.
  <li><a href='https://www.npmjs.com/package/express-rate-limit' target='_blank'>express-rate-limit</a> - limit the number of requests on select routes</li>
  <li><a href='https://www.npmjs.com/package/jsonwebtoken' target='_blank'>jsonwebtoken</a> - token generation</li>
  <li><a href='https://www.npmjs.com/package/method-override' target='_blank'>method-override</a> - allows PUT and DELETE requests in places where the client does not support it
  <li><a href='https://www.npmjs.com/package/mongoose' target='_blank'>mongoose</a> - MongoDB document schemas</li>
  <li><a href='https://www.npmjs.com/package/mongoose-unique-validator' target='_blank'>mongoose-unique-validator</a> - makes Mongoose unique validation errors more informative vs the default E11000 error returned by MongoDB when a violation occurs
  <li><a href='https://www.npmjs.com/package/morgan' target='_blank'>morgan</a> - logging
  <li><a href='https://www.npmjs.com/package/passport' target='_blank'>passport</a> - authentication middleware</li>
  <li><a href='https://www.npmjs.com/package/passport-local' target='_blank'>passport-local</a> - local strategy for passport</li>
  <li><a href='https://www.npmjs.com/package/socket.io' target='_blank'>socket.io</a> - realtime client and server events with websockets</li>
  <li><a href='https://www.npmjs.com/package/underscore' target='_blank'>underscore</a> - convenience</li>
</ul>
