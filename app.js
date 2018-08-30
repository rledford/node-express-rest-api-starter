const http = require('http'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  errorHandler = require('errorhandler'),
  mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const server = http.Server(app);

require('./routes/realtime').init(server);

app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(
  session({
    secret: 'test-api',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorHandler());
}

if (isProduction) {
  mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  );
} else {
  mongoose.connect(
    'mongodb://localhost/api-test',
    { useNewUrlParser: true }
  );
  mongoose.set('debug', true);
}

mongoose.set('useCreateIndex', true);

require('./models/user');
require('./config/passport');

app.use(require('./routes/api/v1'));

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {}
      }
    });
  });
}

const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log(`listening on port ${port}`);
});

module.exports = app;
