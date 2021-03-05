var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });//创建一个写入流
var compress=require('compression')

const errorHandler = require("./util/error-handler.js");
const cors = require("cors")

var { anonymouns } = require('./util/jwtConfig.js')
var uploadDir = path.join(__dirname, 'uploads')

var auth = require('./middlewares/auth.js')

var routers = require('./routes')
var app = express();
const chat = require('./chat')

const bodyParser = require('body-parser');

app.use(compress())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(logger('combined', { stream: accessLogStream }));//将日志写入文件

app.use(express.static(path.join(__dirname, 'public')));  //设置public文件夹为存放静态文件的目录

app.options('*', cors())
app.use(bodyParser.json({"limit":"50mb"}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

app.use(cors());
app.use(cookieParser());
app.use(auth({ anonymouns }))
app.use(routers)



app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  // next(createError(404));
  if (err.name === 'UnauthorizedError') {
    //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send('invalid token...');
  }else{
    res.status(err.status || 500);
  }
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
