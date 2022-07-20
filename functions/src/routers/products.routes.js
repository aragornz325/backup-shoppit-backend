const express = require('express');
const router = express.Router();
const PrductsController = require('../controllers/products.controller');
const productsController = new PrductsController();
const {
  createProduct,
  updateProduct,
  getOne,
} = require('../schemas/prod.schema');
const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');

router.get('', productsController.getProducts);
router.post('/batch/:id', productsController.initSheet);
router.get('/batch/:id', productsController.getProductSheet);
router.patch('/batch/:id', productsController.updateProductSheet);
router.post(
  '/:id',
  validatorHandler(createProduct, 'body'),
  productsController.createProduct
);
router.get('/:id', productsController.getProductById);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
