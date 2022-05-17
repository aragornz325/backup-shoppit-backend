/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { createCarts, getAllcarts, getOneCart, updateCarts, delOneCart } = require('./carts.controller')

const validatorHandler = require('../middlewares/validatorHandler');
const {
  createCartsSc,
  updateCartsSc,
  getOneCartSc,
} = require('../schemas/carts.schema'); /* DTOs */

const productsRoutes = (app) => {
  app.get('/carts', getAllcarts);
  app.post('/carts', validatorHandler(createCartsSc, 'body'), createCarts);
  app.get('/carts/:id', validatorHandler(getOneCartSc, 'params'), getOneCart);
  app.patch('/carts/:id', validatorHandler(getOneCartSc, 'params'), validatorHandler(updateCartsSc, 'body'), updateCarts);
  app.delete('/carts/:id', validatorHandler(getOneCartSc, 'params'), delOneCart);
};

module.exports = {
  productsRoutes,
};
