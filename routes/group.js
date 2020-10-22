const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const GroupController = require('../controllers/groupController');

router.get('/', GroupController.getGroups);
router.get('/:groupId', GroupController.getGroup);
router.post('/', GroupController.createGroup);
router.put('/', GroupController.updateGroup);
router.delete('/', GroupController.deleteGroup);

module.exports = router;
