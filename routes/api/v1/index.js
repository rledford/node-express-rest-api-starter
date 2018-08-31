const router = require('express').Router();

router.get('/api', function(req, res) {
  res.status(200).end('[8-)');
});

router.use('/api/v1', require('./users'));

module.exports = router;
