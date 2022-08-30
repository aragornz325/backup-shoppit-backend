const express = require('express');
const router = express.Router();

const AdsController = require('../controllers/ads.controller');
const adsController = new AdsController();

router.get('', adsController.getAds);

module.exports = router;
