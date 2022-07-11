const useRouter = require('./user.routes');
const googleSheetsRouter = require('./products.router');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/products', googleSheetsRouter);
}

module.exports = routerApi;
