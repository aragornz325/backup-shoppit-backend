//const { WooDb } = require('../../config/wooCommerce');

const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const functions = require('firebase-functions');

const { config } = require('../config/config');

const WooDb = new WooCommerceRestApi({
  url: config.wooCommerce.url,
  consumerKey: config.wooCommerce.consummerKey,
  consumerSecret: config.wooCommerce.consummerSecret,
  version: config.wooCommerce.version,
});
console.log(config.wooCommerce);

class WooCommerceRepository {
  async createProduct(product) {
    const newProduc = await WooDb.post('products', product);

    return newProduc.data;
  }

  async getProducts(limit, offset) {
    const allProducts = await WooDb.get('products');

    return allProducts.data;
  }

  async updateProduct(id, product) {
    const updateProduct = await WooDb.put(`products/${id}`, product);
    return updateProduct.data;
  }

  async deleteProduct(id) {
    const deleteProduct = await WooDb.delete(`products/${id}`);
    return deleteProduct.data;
  }

  async getProductById(id) {
    const product = await WooDb.get(`products/${id}`);
    return product.data;
  }

  async getProductsByCategory(category, limit, offset) {
    const limitparse = parseInt(limit, 10);
    console.log(typeof limitparse);
    const products = await WooDb.get(`products?category=${category}`, {
      per_page: 25,
    });
    return products.data;
  }

  async getCategories() {
    let cat = [];
    const categories = await WooDb.get('products/categories', {
      per_page: 100,
    });
    categories.data.forEach((element) => {
      cat.push(element.id, element.name, element.slug);
    });
    return cat;
  }
}
module.exports = WooCommerceRepository;
