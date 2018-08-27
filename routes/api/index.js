const router = require('express').Router();

router.get('/', (req, res, next) => {
  return res.send(`test-api ${Date.now()}`);
});

module.exports = router;
