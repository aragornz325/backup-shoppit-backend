const WooCommerceService = require('../services/wooCommerce.service');
const wooCommerceService = new WooCommerceService();

exports.createProductWoocommerce = (dataSnapshot) => {
  const payload = dataSnapshot.data();
  return wooCommerceService.createProduct(payload);
};
