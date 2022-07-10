const express = require('express');
const router = express.Router();

const GoogleSheetsController = require('../controllers/googleSheets.controller');
const googleSheetsController = new GoogleSheetsController();

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');

router.post('/:id', googleSheetsController.initSheet);
router.get('/:id', googleSheetsController.getProductSheet);

module.exports = router;
