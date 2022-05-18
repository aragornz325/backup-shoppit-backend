const chequearRoles = require("../middlewares/auth.handler");
const validatorHandler = require("../middlewares/validatorHandler");
const {
  createCategory,
  updateCategory,
  getOnecategory,
} = require('../schemas/category.schema'); /* DTOs */
const decodeToken = require("../utils/decodeToken");
const {
  getCat,
  getCatByID,
  createCat,
  updateCat,
  deleteCat,
} = require('./category.controller');

const categoriesRoutes = (app) => {
  app.get('/categories', getCat);
  app.post('/categories',decodeToken, chequearRoles("seller"), validatorHandler(createCategory, 'body'), createCat);
  app.get('/categories/:id', validatorHandler(getOnecategory, 'params'), getCatByID);
  app.patch('/categories/:id', validatorHandler(getOnecategory, 'params'), validatorHandler(updateCategory, 'body'), updateCat);
  app.delete('/categories/:id', validatorHandler(getOnecategory, 'params'), deleteCat);
};

module.exports = {
  categoriesRoutes,
};
