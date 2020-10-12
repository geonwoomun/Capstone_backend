const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const GroupMemberController = require('../controllers/groupMemberController');

router.post('/apply-group', isLoggedIn, GroupMemberController.createApplyGroup);
router.post('/join-group', isLoggedIn, GroupMemberController.createJoinGroup);
router.post(
  '/prefer-group',
  isLoggedIn,
  GroupMemberController.createPreferGroup
);
router.delete(
  '/prefer-group',
  isLoggedIn,
  GroupMemberController.deletePreferGroup
);

module.exports = router;
