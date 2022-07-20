const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();

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
}

module.exports = ProductsServices;
