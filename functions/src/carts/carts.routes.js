const express = require('express');
const router = express.Router();
const { createCarts, getAllcarts, getOneCart, updateCarts, delOneCart } = require('./carts.controller')

const validatorHandler = require('../middlewares/validatorHandler');
const {
  createCartsSc,
  updateCartsSc,
  getOneCartSc,
} = require('../schemas/carts.schema'); /* DTOs */




router.get('/', getAllcarts);
router.post('/', validatorHandler(createCartsSc, 'body'), createCarts);
router.get('/:id', validatorHandler(getOneCartSc, 'params'), getOneCart);
router.patch('/:id', validatorHandler(getOneCartSc, 'params'), validatorHandler(updateCartsSc, 'body'), updateCarts);
router.delete('/:id', validatorHandler(getOneCartSc, 'params'), delOneCart);


module.exports = router

