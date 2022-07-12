const GoogleSheetsrepository = require('../repositories/googleSheet.repository');
const googleSheetsrepository = new GoogleSheetsrepository();

class ProductsServices {
  async initSheet(sheetID) {
    const init = await googleSheetsrepository.docConstructor(sheetID);
    return init;
  }
}

module.exports = ProductsServices;
