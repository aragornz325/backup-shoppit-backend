/* eslint-disable new-parens */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
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
} = require('./category.controller');

const categoriesRoutes = (app) => {
  app.get('/categories', getCat);
  app.post('/categories', validatorHandler(createCategory, 'body'), createCat);
  app.get('/categories/:id', validatorHandler(getOnecategory, 'params'), getOneCat);
  app.patch('/categories/:id', validatorHandler(updateCategory, 'body'), updateCat);
};

module.exports = {
  categoriesRoutes,
};
