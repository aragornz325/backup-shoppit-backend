const functions = require('firebase-functions');
const GoogleSheetsService = require('../services/googleSheets.services');
const googleSheetsService = new GoogleSheetsService();

class GoogleSheetsController {
  async initSheet(req, res, next) {
    const spreadId = req.params.id;

    functions.logger.info(`spreadId: ${spreadId}`);
    try {
      await googleSheetsService.initSheet(spreadId);
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
      await googleSheetsService.getProductSheet(spreadId);
      functions.logger.info('information obtained correctly');
      res.status(200).send({ msg: 'ok' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GoogleSheetsController;
