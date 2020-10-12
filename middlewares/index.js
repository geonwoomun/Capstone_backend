exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(403).json({ message: '로그인이 필요합니다.' });
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.status(403).json({ message: '비회원 사용할 수 있습니다.' });
};
