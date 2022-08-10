const useRouter = require('./user.routes');
const productsRouter = require('./products.routes');
const membershipsRouter = require('./memberships.routes');
const productRouter = require('./products.routes');
const mercadopagoRouter = require('./mercadoPago.routes');
const paymentsRouter = require('./payments.routes');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/products', productsRouter);
  app.use('/memberships', membershipsRouter);
  app.use('/products', productRouter);
  app.use('/mercadopago', mercadopagoRouter);
  app.use('/payments', paymentsRouter);
}

module.exports = routerApi;
