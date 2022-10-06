const functions = require('firebase-functions');
const WooCommerceRepository = require('../repositories/wooComerce.repository');
const wooCommerceRepository = new WooCommerceRepository();
const ProductsServices = require('../services/products.services');
const productsServices = new ProductsServices();

class WooCommerceService {
  async createProduct(payload) {
    const product = await wooCommerceRepository.createProduct(payload);
    await productsServices.createProduct(product);
    return { message: 'product created' };
  }

  async getProducts(limit, offset) {
    return await wooCommerceRepository.getProducts(limit, offset);
  }
}

module.exports = WooCommerceService;
