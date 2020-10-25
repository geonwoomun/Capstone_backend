const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.get('/', CategoryController.getCategorys);
router.get('/detail', CategoryController.getDetailCategorys);
router.get('/:categoryId', CategoryController.getDetailCategory);

router.post('/', CategoryController.createCategory);
router.post('/detial', CategoryController.createDetailCategory);

module.exports = router;
