const express = require('express');
const router = express.Router();
const CheckoutControllers = require('../controllers/checkout.controllers');
const checkoutControllers = new CheckoutControllers();

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

router.post(
  '',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['customer', 'admin', 'seller'],
    allowSameUser: true,
  }),
  checkoutControllers.createOrder
);

module.exports = router;
