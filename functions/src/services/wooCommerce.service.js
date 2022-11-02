const boom = require('@hapi/boom');

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
    const weight =
      payload.weight === '' || !payload.weight ? '0,5' : payload.weight;

    const dimensions = {
      length: payload.dimensions?.length || '40',
      width: payload.dimensions?.width || '40',
      height: payload.dimensions?.height || '40',
    };
    const stock_quantity = payload.stock_quantity
      ? parseInt(payload.stock_quantity, 10)
      : 0;

    payload = {
      ...payload,
      weight,
      dimensions,
      manage_stock: true,
      stock_quantity,
    };
    const product = await wooCommerceRepository.createProduct(payload);
    productsServices.createProduct(product);
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

  async getShippments() {
    return await wooCommerceRepository.getShippments();
  }

  async deleteProductsInBatch(payload) {
    let deleteInter = [];
    payload.forEach(async (id) => {
      deleteInter.push(parseInt(id, 10));
    });
    const data = {
      delete: deleteInter,
    };
    await wooCommerceRepository.deleteProductInBatch(data);
    productsServices.deleteProductInBatch(payload);
    return { message: 'products deleted' };
  }
}

module.exports = WooCommerceService;
