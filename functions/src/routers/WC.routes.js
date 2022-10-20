const express = require('express');
const router = express.Router();

const WooCommerceController = require('../controllers/WooCommerce.controller');
const wooCommerceController = new WooCommerceController();
const {
  createProductWC,
  updateProductWC,
} = require('../schemas/wooCommerce.schemas');
const validatorHandler = require('../middlewares/validatorHandler');
const { checkApiKey } = require('../middlewares/auth.handler');

router.post(
  '',
  checkApiKey,
  validatorHandler(createProductWC, 'body'),
  wooCommerceController.createProduct
);

router.get('', checkApiKey, wooCommerceController.getProducts);

router.get('/categories', checkApiKey, wooCommerceController.getCategories);
router.get(
  '/categories/:id',
  checkApiKey,
  wooCommerceController.getByCategories
);
router.put(
  '/:id',
  checkApiKey,
  validatorHandler(updateProductWC, 'body'),
  wooCommerceController.updateProduct
);

router.delete('/:id', checkApiKey, wooCommerceController.deleteProduct);

module.exports = router;
