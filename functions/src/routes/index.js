const useRouter = require('../users/user.routes');

function routerApi(app) {
  app.use('/users', useRouter);
}

module.exports = routerApi;
