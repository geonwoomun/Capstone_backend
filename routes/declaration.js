const express = require('express');
const router = express.Router();
const DeclarationController = require('../controllers/declarationController');

router.get('/', DeclarationController.getDeclartion);
router.post('/', DeclarationController.createDeclartion);

module.exports = router;
