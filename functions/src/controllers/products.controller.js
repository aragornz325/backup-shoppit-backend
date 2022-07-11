const functions = require('firebase-functions');
const ProductsService = require('../services/products.services');
const productsService = new ProductsService();

class ProductsController {
  async initSheet(req, res, next) {
    const spreadId = req.params.id;

    functions.logger.info(`spreadId: ${spreadId}`);
    try {
      await productsService.initSheet(spreadId);
      functions.logger.info('Google Sheet ready');
      res.status(200).send({ msg: 'Google Sheet ready' });
    } catch (error) {
      next(error);
    }
  }

  async getProductSheet(req, res, next) {
    const spreadId = req.params.id;
    functions.logger.info(
      `capturing information from the sheet with ID-->: ${spreadId}`
    );
    try {
      await productsService.getProductSheet(spreadId);
      functions.logger.info('information obtained correctly');
      res.status(200).send({ msg: 'ok' });
    } catch (error) {
      next(error);
    }
  }

  async updateProductSheet(req, res, next) {
    const spreadId = req.params.id;
    try {
      await productsService.updateProductSheet(spreadId);
      functions.logger.info('information updated correctly');
      res.status(200).send({ msg: 'ok' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
