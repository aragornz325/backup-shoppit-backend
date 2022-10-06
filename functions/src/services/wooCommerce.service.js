const functions = require('firebase-functions');
const WooCommerceRepository = require('../repositories/wooComerce.repository');
const wooCommerceRepository = new WooCommerceRepository();

class WooCommerceService {
  async createProduct(payload) {
    return await wooCommerceRepository.createProduct(payload);
  }

  async getProducts(limit, offset) {
    return await wooCommerceRepository.getProducts(limit, offset);
  }
}

module.exports = WooCommerceService;
