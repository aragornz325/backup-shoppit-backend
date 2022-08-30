const { db } = require('../../config/firebase');

class AdsRepository {
  constructor() {
    this.adsRef = db.collection('ads');
  }

  async getAds() {
    const adsSnapshot = await this.adsRef.get();
    const ads = adsSnapshot.docs.map((doc) => doc.data());
    return ads;
  }
}

module.exports = AdsRepository;
