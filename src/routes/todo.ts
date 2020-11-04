import express = require('express');
import todoStore = require('../services/todoStore');
import Todo = require('../models/todo');
const router = express.Router();

router.post('/', function (req, res) {
  let isValid = true;
  const messages: string[] = [];
  validateProperty(req.body.title, () => {
    isValid = false;
    messages.push('Bitte Titel eingeben.');
  });
  validateProperty(req.body.description, () => {
    isValid = false;
    messages.push('Bitte Beschreibung eingeben.');
  });
  validateProperty(req.body.importance, () => {
    isValid = false;
    messages.push('Bitte Wichtigkeit auswählen.');
  });
  validateProperty(req.body.done, () => {
    isValid = false;
    messages.push('Bitte Erledigt bis eingeben.');
  });
  if (isValid) {
    const todo: Todo = new Todo(
      req.body.title as string,
      req.body.description as string,
      parseInt(req.body.importance as string),
      new Date(req.body.done as string),
      new Date(Date.now()),
      req.body.finished ? true : false,
    );
    if (req.body.id) {
      todoStore.update(req.body.id, todo, (err, success) => {
        if (success) {
          messages.push('Todo ' + todo.title + ' wurde angepasst.');
          res.redirect('/');
        } else {
          messages.push('Etwas ist schief gelaufen versuchen sie es erneut.');
          renderEmpty(res, req, messages);
        }
      });
    } else {
      todoStore.add(todo, (err, newDoc) => {
        res.redirect('/');
      });
    }
  } else {
    renderEmpty(res, req, messages);
  }
});

const validateProperty = (property: unknown, callback: () => void) => {
  if (!property || property === '') {
    callback();
  }
};

router.get('/:id', function (req, res) {
  console.log('todo.ts: by id handler called');
  todoStore.get(req.params.id, (err, todo) => {
    res.render('todo', {
      title: 'Bearbeiten',
      theme: themeDetector(req),
      isCreate: false,
      todo: todo,
    });
  });
});

/* GET home page. */
router.get('/', function (req, res) {
  console.log('todo.ts: root handler called');
  renderEmpty(res, req);
});

const renderEmpty = (res: express.Response, req: express.Request, messages?: string[]) => {
  res.render('todo', {
    title: 'Erstellen',
    theme: themeDetector(req),
    isCreate: true,
    messages: messages,
  });
};

const themeDetector = (req: express.Request) => {
  return req.query.theme === 'light' || req.body.theme === 'light' ? 'light' : 'dark';
};

module.exports = router;
