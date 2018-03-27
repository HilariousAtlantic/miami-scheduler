exports.default = function(db) {
  var express = require('express');
  var router = express.Router();

  router.get('/search', async (req, res) => {
    const { term, q } = req.query;
    const courses = db.courses.search(
      {
        term: q,
        fields: ['subject', 'number', 'title', 'description']
      },
      {
        term
      }
    );

    res.json({ courses });
  });

  return router;
};
