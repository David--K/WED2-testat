import createError = require('http-errors');
import express = require('express');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');
import sassMiddleware = require('node-sass-middleware');
import indexRouter = require('./routes/index');
import todoRouter = require('./routes/todo');
import hbs = require('hbs');

const app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper('equal', function <T>(value: T, otherValue: T, returnIfrue: string): string {
  return value === otherValue ? returnIfrue : '';
});
hbs.registerHelper('prepareDateForInput', function (value: Date) {
  return value.toISOString().substring(0, 10);
});
hbs.registerHelper('showSortIcon', function (current: string, filter: string, ascending: boolean) {
  return current === filter ? (ascending ? '↓' : '↑') : '';
});
hbs.registerHelper('lightning', function (num: number) {
  let lightning = '';
  for (let i = 0; i < num; i++) {
    lightning += '🗲';
  }
  return lightning;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
    maxAge: 0,
    debug: true,
  }),
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter as express.Application);
app.use('/todo', todoRouter as express.Application);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(() => (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export = app;
