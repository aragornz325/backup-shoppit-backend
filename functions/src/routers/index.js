const useRouter = require('./user.routes');
const productsRouter = require('./products.router');
const membershipsRouter = require('./memberships.router');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/products', productsRouter);
  app.use('/memeberships', membershipsRouter);
}

module.exports = routerApi;
