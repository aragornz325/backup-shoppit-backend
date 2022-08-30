const AdsService = require('../services/ads.services');
const adsService = new AdsService();

class AdsController {
  async getAds(req, res, next) {
    try {
      const ads = await adsService.getAds();
      res.status(200).json(ads);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdsController;
