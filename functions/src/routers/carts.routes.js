const express = require('express');
const router = express.Router();
const CartsController = require('../controllers/carts.controller');
const cartsController = new CartsController();
const { cartSchema } = require('../schemas/carts.schema');
const validatorHandler = require('../middlewares/validatorHandler');

router.post(
  '',
  validatorHandler(cartSchema, 'body'),
  cartsController.createCart
);
router.get('', cartsController.getAllCarts);
router.get('/:cart_id', cartsController.getCartById);
router.patch('/:cart_id', cartsController.updateCart);
router.delete('/:cart_id', cartsController.deleteCart);

module.exports = router;
