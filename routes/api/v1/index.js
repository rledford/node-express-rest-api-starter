const router = require('express').Router();

router.use('/api/v1', require('./users'));

module.exports = router;
