const useRouter = require('./user.routes');
const productsRouter = require('./products.router');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/products', productsRouter);
}

module.exports = routerApi;
