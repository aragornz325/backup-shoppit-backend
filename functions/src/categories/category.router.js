const express = require('express');
const router = express.Router();
const { chequearRoles } = require('../middlewares/auth.handler');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createCategory,
  updateCategory,
  getOnecategory,
} = require('../schemas/category.schema'); /* DTOs */
const decodeToken = require('../utils/decodeToken');
const {
  getCat,
  getCatByID,
  createCat,
  updateCat,
  deleteCat,
} = require('./category.controller');

router.get('/', getCat);
router.post(
  '/',
  decodeToken,
  chequearRoles('seller'),
  validatorHandler(createCategory, 'body'),
  createCat
);
router.get('/:id', validatorHandler(getOnecategory, 'params'), getCatByID);
router.patch(
  '/:id',
  validatorHandler(getOnecategory, 'params'),
  validatorHandler(updateCategory, 'body'),
  updateCat
);
router.delete('/:id', validatorHandler(getOnecategory, 'params'), deleteCat);

module.exports = router;
