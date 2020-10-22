const express = require('express');
const router = express.Router();
const EvaluateController = require('../controllers/evaluateController');

router.get('/', EvaluateController.getEvaluate);
router.post('/', EvaluateController.createEvaluate);
router.delete('/:evaluateId', EvaluateController.removeEvaluate);

module.exports = router;
