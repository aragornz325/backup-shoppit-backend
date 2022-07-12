const express = require('express');
const router = express.Router();

const ProductsController = require('../controllers/products.controller');
const productsController = new ProductsController();

router.post('/batch/id', productsController.initSheet);

module.exports = router;
