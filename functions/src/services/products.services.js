const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const GoogleSheetsRepository = require('../repositories/googleSheet.repository');
const googleSheetsRepository = new GoogleSheetsRepository();

class ProductsServices {
  async createProduct(payload, id) {
    return await productsRepository.createProduct(payload, id);
  }

  async getProductById(id) {
    return await productsRepository.getProductById(id);
  }

  async getProducts(query) {
    return await productsRepository.getProducts(query);
  }

  async updateProduct(id, payload, merge) {
    return await productsRepository.updateProduct(id, payload, merge);
  }

  async deleteProduct(id) {
    return await productsRepository.deleteProduct(id);
  }

  async initSheet(id, payload) {
    return await googleSheetsRepository.initSheet(id, payload);
  }
  async getProductSheet(id, userId) {
    return await googleSheetsRepository.getProduct(id, userId);
  }
}

module.exports = ProductsServices;
