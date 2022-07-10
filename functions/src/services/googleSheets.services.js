const { config } = require('../config/config');
const boom = require('@hapi/boom');
const GoogleSheetsRepository = require('../repositories/googleSheets.repository');
const googleSheetsRepository = new GoogleSheetsRepository();
const { validateSheetsProduct } = require('../schemas/prod.schema');
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const functions = require('firebase-functions');

class GoogleSheetsService {
  async initSheet(spreadId) {
    const init = await googleSheetsRepository.initSheet(spreadId);
    return init;
  }

  async getProductSheet(spreadId) {
    functions.logger.info(
      `capturing information from the sheet with ID-->: ${spreadId}`
    );
    await googleSheetsRepository.getProduct(spreadId);

    return { msg: 'ok' };
  }
}

module.exports = GoogleSheetsService;
