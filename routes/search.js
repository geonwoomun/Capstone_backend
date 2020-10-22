const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/:groupName', searchController.searchByName);

module.exports = router;
