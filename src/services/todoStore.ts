import Datastore = require('nedb');
import Todo = require('../models/todo');
const db = new Datastore({ filename: './data/todo.db', autoload: true });

class TodoStore {
  add(todo: Todo, callback: (err: Error | null, newDoc: Todo) => void) {
    console.log('add todo');
    db.insert(todo, function (err: Error | null, newDoc: Todo) {
      console.log('succesfully inserted Todo with id: ' + newDoc._id);
      if (callback) {
        callback(err, newDoc);
      }
    });
  }

  update(id: string, todo: Todo, callback: (err: Error | null, success: boolean) => void) {
    db.update({ _id: id }, todo, {}, function (err, numDocs) {
      callback(err, numDocs === 1);
    });
  }

  get(id: string, callback: (err: Error | null, doc: Todo) => void) {
    db.findOne({ _id: id }, function (err, doc) {
      callback(err, doc);
    });
  }

  all(
    callback: (err: Error | null, newDoc: Todo[]) => void,
    sortBy: string,
    ascending: boolean,
    onlyFinished: boolean,
  ) {
    const filter = onlyFinished ? { finished: true } : {};
    db.find(filter)
      .sort({ [sortBy]: ascending ? 1 : -1 })
      .exec(function (err: Error | null, docs: Todo[]) {
        callback(err, docs);
      });
  }
}

export = new TodoStore();
