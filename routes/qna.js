const express = require('express');
const router = express.Router();
const QnaController = require('../controllers/qnaController');

router.get('/:groupId', QnaController.getQnas);
router.post('/', QnaController.createQna);
router.delete('/:qnaId', QnaController.deleteQna);

module.exports = router;
