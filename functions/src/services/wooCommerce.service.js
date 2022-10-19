const boom = require('@hapi/boom');
const functions = require('firebase-functions');
const WooCommerceRepository = require('../repositories/wooComerce.repository');
const wooCommerceRepository = new WooCommerceRepository();
const ProductsServices = require('../services/products.services');
const productsServices = new ProductsServices();

class WooCommerceService {
  async createProduct(payload) {
    const checkProduct = await productsServices.getProductByName(payload.name);
    if (checkProduct.name === payload.name) {
      throw boom.conflict('Product with same name already exists');
    }
    const product = await wooCommerceRepository.createProduct(payload);
    await productsServices.createProduct(product);
    return { message: 'product created' };
  }

  async getProducts(limit, offset) {
    return await wooCommerceRepository.getProducts(limit, offset);
  }

  async updateProduct(id, payload) {
    const product = await wooCommerceRepository.updateProduct(id, payload);
    await productsServices.updateProduct(id, product, true);
    return { message: 'product updated' };
  }

  async deleteProduct(id) {
    const product = await wooCommerceRepository.deleteProduct(id);
    await productsServices.deleteProduct(product);
    return { message: 'product deleted' };
  }
}

module.exports = WooCommerceService;
