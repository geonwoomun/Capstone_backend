const express = require('express');
const router = express.Router();
const RecruitController = require('../controllers/recruitController');

router.get('/:recruitId', RecruitController.getRecruit);
router.get('/:categoryId', RecruitController.getRecruits);
router.post('/', RecruitController.createRecruit);
router.put('/', RecruitController.updateRecruit);
router.delete('/', RecruitController.deleteRecruit);

module.exports = router;
