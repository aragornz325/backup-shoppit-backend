const validatorHandler = require("../middlewares/validatorHandler");
const {
  createCategory,
  updateCategory,
  getOnecategory,
} = require('../schemas/category.schema'); /* DTOs */
const {
  getCat,
  getOneCat,
  createCat,
  updateCat,
  deleteCat,
} = require('./category.controller');

const categoriesRoutes = (app) => {
  app.get('/categories', getCat);
  app.post('/categories', validatorHandler(createCategory, 'body'), createCat);
  app.get('/categories/:id', validatorHandler(getOnecategory, 'params'), getOneCat);
  app.patch('/categories/:id', validatorHandler(getOnecategory, 'params'), validatorHandler(updateCategory, 'body'), updateCat);
  app.delete('/categories/:id', validatorHandler(getOnecategory, 'params'), deleteCat);
};

module.exports = {
  categoriesRoutes,
};
