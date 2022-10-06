//const { WooDb } = require('../../config/wooCommerce');

const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const functions = require('firebase-functions');

const { config } = require('../config/config');

const WooDb = new WooCommerceRestApi({
  url: 'https://paginaprueba.tech/',
  consumerKey: 'ck_1c566c3e445125ae147bc619e374bc7306d7fab0',
  consumerSecret: 'cs_34ecdc90b13b3209f864a9af331012d20b693dd1',
  version: 'wc/v3',
});

class WooCommerceRepository {
  async createProduct(product) {
    const { error } = await WooDb.post('products', product);
    if (error) {
      throw new error(error);
    }
    return { msg: 'ok' };
  }

  async getProducts(limit, offset) {
    const allProducts = await WooDb.get('products');

    return allProducts.data;
  }
}
module.exports = WooCommerceRepository;
