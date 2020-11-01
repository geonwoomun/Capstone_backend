const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const AuthController = require('../controllers/authController');
const MemberController = require('../controllers/memberController');

router.post('/join', isNotLoggedIn, AuthController.joinMember);
router.post('/login', isNotLoggedIn, AuthController.loginMember);
router.delete('/logout', isLoggedIn, AuthController.logoutMember);
router.delete('/', isLoggedIn, AuthController.deleteMember);

// /member
router.get('/', MemberController.getMyInfo);
router.get('/:memberId', MemberController.getMemberInfo);
router.put('/', MemberController.updateMemberInfo);
router.put('/category', MemberController.updateCategory);
router.put('/location', MemberController.updateLocation);

module.exports = router;
