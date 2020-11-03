import express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Home',
    todos: [
      {
        title: 'krassistes TODO',
        description: 'Beschribig vom aller krasssiste TODO',
        isFinished: true,
      },
      {
        title: 'Würkli das krassistes TODO',
        description: 'Beschribig vom würkli aller krasssiste TODO',
        isFinished: false,
      },
    ],
  });
});

module.exports = router;
