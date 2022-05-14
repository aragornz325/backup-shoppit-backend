/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const {
  getAll, getProduct, AddProduct, updateProductCon,
} = require('./products.controller');
const validatorHandler = require('../middlewares/validatorHandler');
const { createProduct, updateProduct, getOne } = require('../schemas/prod.schema');

const productsRoutes = (app) => {
  app.get('/products', getAll);
  app.post('/products', validatorHandler(createProduct, 'body'), AddProduct);
  app.get('/products/:id', validatorHandler(getOne, 'params'), getProduct);
  app.patch('/products/:id', validatorHandler(updateProduct, 'body'), updateProductCon);
};

module.exports = {
  productsRoutes,
};
