const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require('../../config/config');

class GoogleSheetsrepository {
  async docConstructor(sheetID) {
    const doc = new GoogleSpreadsheet(sheetID);
    await doc.useServiceAccountAuth({
      client_email: config.client_email,
      private_key: config.private_key,
    });
    return doc;
  }
}

module.exports = GoogleSheetsrepository;
