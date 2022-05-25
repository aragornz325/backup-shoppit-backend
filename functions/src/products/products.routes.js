const express = require('express');
const router = express.Router();
const {
  getAll, getProduct, addProduct, updateProductCon, createNewAstroProduct, getAllAstro
} = require('./products.controller');
const validatorHandler = require('../middlewares/validatorHandler');
const { createProduct, updateProduct, getOne } = require('../schemas/prod.schema'); /* DTOs */

  //TODO: falta validacion de datos 
  router.post('/astroselling', createNewAstroProduct )
  router.get('/astroselling', getAllAstro)

  router.get('/', getAll);
  router.post('/', validatorHandler(createProduct, 'body'), addProduct);
  router.get('/:id', validatorHandler(getOne, 'params'), getProduct);
  router.patch('/:id', validatorHandler(updateProduct, 'body'), updateProductCon);



module.exports = router
