const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const awsConfig = require('../config/awsconfig');

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

const s3 = new aws.S3(awsConfig);

exports.upload = multer({
  storage: multerS3({
    s3,
    bucket: 'pknu-capstone',
    acl: 'public-read-write',
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}${file.originalname.split('.')[0]}`);
    },
  }),
});
