<h4>Node, Express, Mongoose, and Passport REST API Starter (with realtime)</h4>
<p>
This project contains the basic files, folders, and npm packages for building a simple REST API server that is also capable of providing realtime data to connected clients. Only the user model, routes, and realtime namespace are implemented, but the code in these files can be used as a reference when adding new models, routes, middleware, etc. I used <a href='https://github.com/gothinkster/node-express-realworld-example-app' target='_blank'>this project by gothinkster</a> as a guide - the code seems to follow many of the best practices for REST API development, and the project structure makes sense (to me). I looked through a lot of REST API boilerplates and didn't really like the way many of the projects were setup. I had also been testing a lot of frameworks like <a href='https://loopback.io' target='_blank'>LoopBack</a> and <a href='https://sailsjs.com' target='_blank'>SailsJS</a> (which are great), but in the end I just wanted more control and less magic.
</p>
<h4>The goals of this project are to...</h4>
<ul>
  <li>have an easy-to-understand and approachable project structure</li>
  <li>provide documented code that explains what is going on</li>
  <li>demonstrate how to process API requests to make changes to the database</li>
  <li>use a JSON web token system for API requests after a user authenticates with the server</li>
  <li>use the same JSON web token system to authorize socket.io connection requests</li>
  <li>use socket.io to send events when changes occur in the database</li>
  <li>automate API testing with <a href='https://mochajs.org/' target='_blank'>MochaJS</a> and <a href='www.chaijs.com' target='_blank'>ChaiJS</a></li>
  <li>use HTTPS (this is not implemented yet)</li>
</ul>
<h4>See how to...</h4>
<ul>
  <li>wire up an Express app</li>
  <li>implement a login system using Passport local strategies</li>
  <li>use middleware to simplify the code within the routes</li>
  <li>protect API routes using middleware</li>
  <li>restrict authenticated user requests based on their roles using middleware</li>
  <li>limit the number of requests a client can make to one or more API endpoints</li>
  <li>create socket.io namespaces that require users to be authenticated to join</li>
  <li>use socket.io to send events to connected clients when the database updates a document</li>
  <li>implement methods and statics for a Mongoose schema</li>
  <li>respond to requests with helpful error messages</li>
  <li>automate API testing with MochaJS and ChaiJS</li>
</ul>
<h4>Using these packages...</h4>
<ul>
  <li><a href='https://www.npmjs.com/package/body-parser' target='_blank'>body-parser</a> - parse the request body and makes it available under the req.body property</li>
  <li><a href='https://www.npmjs.com/package/cors' target='_blank'>cors</a> - allow cross origin requests to access the API</li>
  <li><a href='https://www.npmjs.com/package/errorhandler' target='_blank'>errorhandler</a> - used ONLY during development for more detailed error messages to be sent back to the client
  <li><a href='https://www.npmjs.com/package/express' target='_blank'>express</a> - web application framework</li>
  <li><a href='https://www.npmjs.com/package/express-jwt' target='_blank'>express-jwt</a> - middleware to read JWTs and add the claims to the request payload</li>
  <li><a href='https://www.npmjs.com/package/express-session' target='_blank'>express-session</a> - session middleware for storing relevant user information - uses the default MemoryStore and should be replaced with something like <a href='https://npmjs.com/package/connect-mongo' target='_blank'>connect-mongo</a> to persist data instead of the default store which is prone to memory leaks
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
