/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const {createCarts} = require('./carts.controller')

const validatorHandler = require("../middlewares/validatorHandler");
const {
  createCartsSc,
  updateCarts,
  getOneCart,
} = require('../schemas/carts.schema'); /* DTOs */

const productsRoutes = (app) => {
  app.get('/carts', );
  app.post('/carts', validatorHandler(createCarts, 'body'), createCartsSc);
  app.get('/carts/:id', validatorHandler(getOneCart, 'params'), );
  app.patch('/carts/:id', validatorHandler(getOneCart, 'params'), validatorHandler(updateCarts, 'body'), );
};

module.exports = {
  productsRoutes,
};
