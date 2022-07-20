const useRouter = require('./user.routes');
const productsRouter = require('./products.router');
const membershipsRouter = require('./memberships.routes');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/products', productsRouter);
  app.use('/memberships', membershipsRouter);
}

module.exports = routerApi;
