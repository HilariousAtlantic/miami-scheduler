module.exports = function(db) {
  var express = require('express');
  var router = express.Router();

  router.get('/search', async (req, res) => {
    const { term, query } = req.query;
    const courses = await db.courses.search(
      {
        term: `'${query}'`,
        fields: ['subject', 'number', 'title', 'searchables'],
        where: {
          term
        }
      },
      {
        fields: ['code', 'subject', 'number', 'title'],
        limit: 50
      }
    );

    res.json({ courses });
  });

  return router;
};
