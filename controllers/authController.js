const passport = require('passport');
const bcrypt = require('bcrypt');
const Member = require('../models/member/member');

module.exports = class AuthController {
  static async joinMember(req, res) {
    const { email, name, password, telephone, gender } = req.body;
    try {
      const exUser = await Member.findOne({ where: { email } });
      if (exUser) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      }

      const hashPassword = await bcrypt.hash(password, 12);
      await Member.create({
        email,
        name,
        password: hashPassword,
        telephone,
        gender,
      });
      return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: '서버에러 입니다.' });
    }
  }

  static async loginMember(req, res) {
    passport.authenticate('local', (authError, member, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }

      if (!member) {
        return res.status(400).json({ message: '가입 되지 않은 유저입니다.' });
      }

      return req.login(member, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return res.status(500).json({ message: '서버 에러입니다.' });
        }
        return res.status(200).json({ message: '로그인 성공' });
      });
    })(req, res);
  }

  static async logoutMember(req, res) {
    req.logout();
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.status(200).json({ message: '로그아웃 성공' });
  }

  static async deleteMember(req, res) {
    const { email, password } = req.body;
    try {
      const user = await Member.findOne({ where: { email } });
      if (!user) {
        return res
          .status(400)
          .json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
      }

      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return res
          .status(400)
          .json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
      }

      await Member.destroy({
        where: {
          email,
        },
      });

      return res.status(200).json({ message: '회원탈퇴 성공' });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
};
