const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/groups', searchController.searchGroupByFilter);
router.get('/recruit/:recruitName', searchController.searchRecruitName);

module.exports = router;
