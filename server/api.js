exports.default = function(db) {
  var express = require('express');
  var router = express.Router();

  router.get('/search', (req, res) => {
    const { q } = req.query;
  });

  return router;
};
