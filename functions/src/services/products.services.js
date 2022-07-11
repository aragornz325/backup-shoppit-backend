const GoogleSheetsRepository = require('../repositories/googleSheets.repository');
const googleSheetsRepository = new GoogleSheetsRepository();

const functions = require('firebase-functions');

class ProductsService {
  async initSheet(spreadId) {
    const init = await googleSheetsRepository.initSheet(spreadId);
    return init;
  }

  async getProductSheet(spreadId) {
    functions.logger.info(
      `capturing information from the sheet with ID: ${spreadId}`
    );

    await googleSheetsRepository.getProduct(spreadId);

    return { msg: 'ok' };
  }

  async updateProductSheet(spreadId) {
    functions.logger.info(
      `updating information in the sheet with ID: ${spreadId}`
    );

    await googleSheetsRepository.updateProduct(spreadId);

    return { msg: 'ok' };
  }
}

module.exports = ProductsService;
