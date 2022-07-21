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

router.get('', checkApiKey, productsController.getProducts);
router.post(
  '/batch/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.initSheet
);
router.get(
  '/batch/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.getProductSheet
);

router.post(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  validatorHandler(createProduct, 'body'),
  productsController.createProduct
);
router.get('/:id', checkApiKey, productsController.getProductById);
router.put(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.updateProduct
);
router.delete(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  productsController.deleteProduct
);

module.exports = router;
