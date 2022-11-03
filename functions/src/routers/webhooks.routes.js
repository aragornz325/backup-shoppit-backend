const express = require('express');
const router = express.Router();

const WebhooksController = require('../controllers/webhooks.controller');
const webhooksController = new WebhooksController();

router.post('/order', webhooksController.woocomerceOrders);
router.post('/updateproduct', webhooksController.woocomerceUpdateProducts);

module.exports = router;
