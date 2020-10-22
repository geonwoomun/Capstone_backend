const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const GroupMemberController = require('../controllers/groupMemberController');

router.get('/apply-member/:groupId', GroupMemberController.getApplyMember);
router.get('/apply-group/:memberId', GroupMemberController.getApplyGroup);
router.post('/apply-group', GroupMemberController.createApplyGroup);
router.post('/join-group', GroupMemberController.createJoinGroup);
router.get('/prefer-group/:memberId', GroupMemberController.getPreferGroup);
router.put('/prefer-group', GroupMemberController.updatePreferGroup);
router.post('/prefer-group', GroupMemberController.createPreferGroup);
router.delete('/prefer-group', GroupMemberController.deletePreferGroup);

module.exports = router;
