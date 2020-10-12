const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const groupController = require('../controllers/groupController');

router.get('/', groupController.getGroup);
router.post('/', isLoggedIn, groupController.createGroup);
router.put('/', isLoggedIn, groupController.updateGroup);
router.delete('/', isLoggedIn, groupController.deleteGroup);

module.exports = router;
