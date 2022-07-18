const useRouter = require('./user.routes');
const productsRouter = require('./products.router');
const membershipsRouter = require('./memberships.routes');
const sheet2 = require('./sheet2.routes');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/products', productsRouter);
  app.use('/memeberships', membershipsRouter);
  app.use('/sheet2', sheet2);
}

module.exports = routerApi;
