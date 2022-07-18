const GoogleApi = require('../repositories/googleSheet.repository2');
const googleApi = new GoogleApi();

class Sheet2Service {
  async getSheet2(id) {
    const metadata = await googleApi.connectGoogle(id);
    return metadata;
  }
}
module.exports = Sheet2Service;
