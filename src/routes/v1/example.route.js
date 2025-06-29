const express = require('express');
const router = express.Router();
const upload = require('@middlewares/upload');
const exampleController = require('@controllers/example.controller');

router.post('/upload/mw-single', upload.single('file'), exampleController.mwUploadSingle);
router.post('/upload/mw-multiple', upload.array('files', 10), exampleController.mwUploadMultiple);
router.post('/upload/single', exampleController.uploadSingle);
router.post('/upload/multiple', exampleController.uploadMultiple);

module.exports = router;