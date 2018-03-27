module.exports = function(db) {
  var express = require('express');
  var router = express.Router();

  router.get('/terms', async (req, res) => {
    const terms = await db.terms.find();
    res.json({ terms });
  });

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

  router.get('/courses', async (req, res) => {
    const { code, term, subject, number } = req.query;

    const plan = {};
    if (code) plan.code = code.toUpperCase().split(',');
    if (term) plan.term = term.split(',');
    if (subject) plan.subject = subject.toUpperCase().split(',');
    if (number) plan.number = number.split(',');

    const courses = await db.courses.find(plan, {
      fields: ['code', 'subject', 'number', 'title'],
      limit: 50
    });

    res.json({ courses });
  });

  return router;
};
