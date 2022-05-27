const express = require('express');
const router = express.Router();
const {
  getAll,
  getProduct,
  addProduct,
  updateProductCon,
  createNewAstroProduct,
  getAllAstro,
  getOneAstro,
  deleteProduct,
} = require('./products.controller');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createProduct,
  updateProduct,
  getOne,
} = require('../schemas/prod.schema'); /* DTOs */

//TODO: falta validacion de datos en los endpoints porque estoy evaluando las condiciones de astrosellig

router.get('/', getAll);
router.post('/', validatorHandler(createProduct, 'body'), addProduct);

router.post('/astroselling', createNewAstroProduct);
router.get('/astroselling', getAllAstro);
router.get('/astroselling/:id', getOneAstro);

router.get('/:id', validatorHandler(getOne, 'params'), getProduct);
router.patch('/:id', validatorHandler(updateProduct, 'body'), updateProductCon);
router.delete('/:id', validatorHandler(getOne, 'params'), deleteProduct);

module.exports = router;
