const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imageController');
const { upload } = require('../middlewares');

router.post('/', upload.array('images', 3), ImageController.uploadImages);

module.exports = router;
