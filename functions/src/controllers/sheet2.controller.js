const Sheet2Service = require('../services/sheet2.service');
const sheet2Service = new Sheet2Service();

class Sheet2Controller {
  async getSheet2(req, res, next) {
    try {
      const { id } = req.params;
      const sheet2 = await sheet2Service.getSheet2(id);
      res.status(200).send(sheet2);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Sheet2Controller;
