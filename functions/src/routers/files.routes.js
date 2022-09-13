const express = require('express');
const router = express.Router();
const fileController = require('../controllers/files.controller');
const filesController = new fileController();

const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '/functions/src/uploads/sheets'),
});

router.post('', upload.single('sheet'), filesController.uploadFile);

module.exports = router;
