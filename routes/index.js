const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const GroupMemberController = require('../controllers/groupMemberController');

router.get('/apply/:applyId', GroupMemberController.getApply);
router.get('/apply-member/:groupId', GroupMemberController.getApplyMember);
router.get('/apply-group/:memberId', GroupMemberController.getApplyGroup);
router.patch('/apply-group', GroupMemberController.rejectApplyMember);
router.post('/apply-group', GroupMemberController.createApplyGroup);
router.get('/join-group/:memberId', GroupMemberController.getJoinGroup);
router.post('/join-group', GroupMemberController.createJoinGroup);
router.put('/join-group', GroupMemberController.updateMemberInfo);
router.delete('/join-group', GroupMemberController.deleteJoinGroup);
router.get('/prefer-group/:memberId', GroupMemberController.getPreferGroup);
router.put('/prefer-group', GroupMemberController.updatePreferGroup);
router.post('/prefer-group', GroupMemberController.createPreferGroup);
router.delete('/prefer-group', GroupMemberController.deletePreferGroup);

module.exports = router;
