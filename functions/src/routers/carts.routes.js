const express = require('express');
const router = express.Router();
const CartsController = require('../controllers/carts.controller');
const cartsController = new CartsController();
const { cartSchema, cartUpdateSchema } = require('../schemas/carts.schema');
const validatorHandler = require('../middlewares/validatorHandler');

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
  validatorHandler(cartSchema, 'body'),
  cartsController.createCart
);
router.get(
  '',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['customer', 'admin', 'seller'],
    allowSameUser: true,
  }),
  cartsController.getAllCarts
);
checkApiKey,
  router.get(
    '/byownerid',
    checkApiKey,
    isAuthenticated,
    isAuthorized({
      hasRole: ['customer', 'admin', 'seller'],
      allowSameUser: true,
    }),
    cartsController.getCartByOwner
  );
router.get(
  '/:cart_id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['customer', 'admin', 'seller'],
    allowSameUser: true,
  }),
  cartsController.getCartById
);
router.patch(
  '/:cart_id',
  validatorHandler(cartUpdateSchema, 'body'),
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['customer', 'admin', 'seller'],
    allowSameUser: true,
  }),
  cartsController.updateCart
);
router.delete(
  '/:cart_id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['customer', 'admin', 'seller'],
    allowSameUser: true,
  }),
  cartsController.deleteCart
);

module.exports = router;
