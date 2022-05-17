const {
  getAll, getProduct, addProduct, updateProductCon,
} = require('./products.controller');
const validatorHandler = require('../middlewares/validatorHandler');
const { createProduct, updateProduct, getOne } = require('../schemas/prod.schema'); /* DTOs */

const productsRoutes = (app) => {
  app.get('/products', getAll);
  app.post('/products', validatorHandler(createProduct, 'body'), addProduct);
  app.get('/products/:id', validatorHandler(getOne, 'params'), getProduct);
  app.patch('/products/:id', validatorHandler(updateProduct, 'body'), updateProductCon);
};

module.exports = {
  productsRoutes,
};
