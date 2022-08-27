const express = require('express');
const router = express.Router();
const CheckoutControllers = require('../controllers/checkout.controllers');
const checkoutControllers = new CheckoutControllers();

router.post('', checkoutControllers.createOrder);

module.exports = router;
