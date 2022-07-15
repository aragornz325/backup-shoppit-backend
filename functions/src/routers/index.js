const useRouter = require('./user.routes');
const membershipsRouter = require('./memberships.routes');
const productRouter = require('./products.routes');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/memberships', membershipsRouter);
  app.use('/products', productRouter);
}

module.exports = routerApi;
