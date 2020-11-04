class Todo {
  _id?: string;
  title: string;
  description: string;
  importance: number;
  done: Date;
  created: Date;
  finished: boolean;

  constructor(title: string, description: string, importance: number, done: Date, created: Date, finished: boolean) {
    this.title = title;
    this.description = description;
    this.importance = importance;
    this.done = done;
    this.created = created;
    this.finished = finished;
  }
}

export = Todo;
