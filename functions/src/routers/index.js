const useRouter = require('./user.routes');
const googleSheetsRouter = require('./googleSheets.router');

function routerApi(app) {
  app.use('/users', useRouter);
  app.use('/googlesheets', googleSheetsRouter);
}

module.exports = routerApi;
