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

  async getProducts(limit, page) {
    return await wooCommerceRepository.getProducts(limit, page);
  }

  async getProductById(id) {
    return await wooCommerceRepository.getProductById(id);
  }

  async updateProduct(id, payload) {
    const product = await wooCommerceRepository.updateProduct(id, payload);
    await productsServices.updateProduct(id, product, true);
    return { message: 'product updated' };
  }

  async deleteProduct(id) {
    await productsServices.deleteProductWooCoomerce(id);
    await wooCommerceRepository.deleteProduct(id);
    return { message: 'product deleted' };
  }

  async getProductsByCategory(id, limit, page) {
    const products = await wooCommerceRepository.getProductsByCategory(
      id,
      limit,
      page
    );
    return products;
  }

  async getCategories() {
    return await wooCommerceRepository.getCategories();
  }

  async searchByStringProducts(search, limit, page) {
    return await wooCommerceRepository.searchByStringProducts(
      search,
      limit,
      page
    );
  }
}

module.exports = WooCommerceService;
