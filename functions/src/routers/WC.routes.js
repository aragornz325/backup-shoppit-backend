const express = require('express');
const router = express.Router();
const WooCommerceController = require('../controllers/wooCommerce.controller');
const wooCommerceController = new WooCommerceController();

router.post('', wooCommerceController.createProduct);
router.get('', wooCommerceController.getProducts);

module.exports = router;
