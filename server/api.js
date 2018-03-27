module.exports = function(db) {
  var express = require('express');
  var router = express.Router();

  router.get('/search', async (req, res) => {
    const { term, q } = req.query;
    const courses = await db.courses
      .search({
        term: q,
        fields: ['subject', 'number', 'title', 'description']
      })
      .then(courses => courses.filter(course => course.term === term));

    res.json({ courses });
  });

  return router;
};
