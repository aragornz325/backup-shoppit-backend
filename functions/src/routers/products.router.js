const express = require('express');
const router = express.Router();

const ProductsController = require('../controllers/products.controller');
const productsController = new ProductsController();

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');

router.post('/batch/:id', productsController.initSheet);
router.get('/batch/:id', productsController.getProductSheet);
router.patch('/batch/:id', productsController.updateProductSheet);

module.exports = router;
