const AdsRepository = require('../repositories/ads.repository');
const adsRepository = new AdsRepository();

class AdsService {
  async getAds() {
    return await adsRepository.getAds();
  }
}

module.exports = AdsService;
