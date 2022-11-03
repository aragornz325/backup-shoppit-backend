const WooCommerceAPI = require('woocommerce-api');
const { config } = require('../src/config/config');

const WooDb = new WooCommerceAPI({
  url: 'https://paginaprueba.tech/',
  consumerKey: config.wooCommerce.consummerKey,
  consumerSecret: config.wooCommerce.consummerSecret,
  wpAPI: true,
  version: 'wc/v1',
});

module.exports = WooDb;
