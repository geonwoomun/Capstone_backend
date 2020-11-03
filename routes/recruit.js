const express = require('express');
const router = express.Router();
const RecruitController = require('../controllers/recruitController');

router.get('/:recruitId', RecruitController.getRecruit);
router.get('/', RecruitController.getRecruits);
router.get('/member/:memberId', RecruitController.getMemberRecruits);
router.post('/', RecruitController.createRecruit);
router.put('/', RecruitController.updateRecruit);
router.delete('/', RecruitController.deleteRecruit);

module.exports = router;
