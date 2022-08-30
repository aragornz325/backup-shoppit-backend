const express = require('express');
const router = express.Router();

const AdsController = require('../controllers/ads.controller');
const adsController = new AdsController();
const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

router.get('', checkApiKey, adsController.getAds);

module.exports = router;
