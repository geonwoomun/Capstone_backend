const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Member = require('../models/member/member');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const exUser = await Member.findOne({ where: { email } });
          if (!exUser) {
            done(null, false, { message: '가입 되지 않은 회원입니다.' });
            return;
          }

          const result = await bcrypt.compare(password, exUser.password);
          if (!result) {
            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            return;
          }

          done(null, exUser);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
