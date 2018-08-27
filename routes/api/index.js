const router = require('express').Router();
const otherRouter = require('express').Router();

router.use('/', require('./users'));

module.exports = router;
