/* eslint-disable new-parens */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const validatorHandler = require('../middlewares/validatorHandler');
const { createCategory, updateCategory, getOnecategory } = require('../schemas/category.schema');
const CategoriesController = require('./category.controller');
const categoriesController = new CategoriesController();

const productsRoutes = (app) => {
  app.get('/categories', categoriesController.getCat());
  app.post(
    '/categories',
    validatorHandler(createCategory, 'body'),
    categoriesController.createCat(),
  );
  app.get(
    '/categories/:id',
    validatorHandler(getOnecategory, 'params'),
    categoriesController.getOneCat(),
  );
  app.patch(
    '/categories/:id',
    validatorHandler(updateCategory, 'body'),
    categoriesController.updateCat(),
  );
};

module.exports = {
  productsRoutes,
};
