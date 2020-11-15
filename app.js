const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const createError = require('http-errors');
const passport = require('passport');
const passportConfig = require('./passport');

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const memberRouter = require('./routes/member');
const groupRouter = require('./routes/group');
const categoryRouter = require('./routes/category');
const declareRouter = require('./routes/declaration');
const searchRouter = require('./routes/search');
const recruitRouter = require('./routes/recruit');
const qnaRouter = require('./routes/qna');
const evaluteRouter = require('./routes/evaluate');
const imageRouter = require('./routes/uploadFile');
const indexRouter = require('./routes');

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
// require('./config/passport');
const sequelize = require('./models');

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: 'none',
      maxAge: 10000 * 600 * 2,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api', (req, res) => {
//   res.send('api 홈');
// });

app.use('/api/member', memberRouter);
app.use('/api/groups', groupRouter);
app.use('/api/categorys', categoryRouter);
app.use('/api/declaration', declareRouter);
app.use('/api/search', searchRouter);
app.use('/api/recruits', recruitRouter);
app.use('/api/qna', qnaRouter);
app.use('/api/evaluation', evaluteRouter);
app.use('/api/images', imageRouter);
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`start api server ${port}`);
});
