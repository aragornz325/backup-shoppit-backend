const useRouter = require('./user.routes');

function routerApi(app) {
  app.use('/users', useRouter);
}

module.exports = routerApi;
