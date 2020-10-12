const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const AuthController = require('../controllers/authController');

router.post('/join', isNotLoggedIn, AuthController.joinMember);
router.post('/login', isNotLoggedIn, AuthController.loginMember);
router.delete('/logout', isLoggedIn, AuthController.logoutMember);

module.exports = router;
