import express = require('express');
import todoStore = require('../services/todoStore');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  const onlyFinished = req.query.onlyFinished === 'true' ? true : false;
  const theme = themeDetector(req);
  if (req.query.filter) {
    console.log('params: ' + req.query.filter + ' ' + req.query.ascending);
    render(res, theme, req.query.filter as string, req.query.ascending === 'true' ? true : false, onlyFinished);
  } else {
    render(res, theme, Filter.DoneDate, true, onlyFinished);
  }
});

const render = (res: express.Response, theme: string, filter: string, ascending: boolean, onlyFinished: boolean) => {
  todoStore.all(
    (err, todos) => {
      res.render('index', {
        theme: theme,
        title: 'Home',
        todos: todos,
        ascending: !ascending,
        filter: filter,
        onlyFinished: !onlyFinished,
      });
    },
    filter,
    ascending,
    onlyFinished,
  );
};

enum Filter {
  DoneDate = 'done',
  CreateDate = 'created',
  Importance = 'importance',
}

const themeDetector = (req: express.Request) => {
  return req.query.theme === 'light' ? 'light' : 'dark';
};

module.exports = router;
