const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const GoogleSheetsRepository = require('../repositories/googleSheet.repository');

const googleSheetsRepository = new GoogleSheetsRepository();

const dimensions = {
  width: 0,
  height: 0,
  longitude: 0,
  weight: 0,
};

class ProductsServices {
  async createProduct(payload, id) {
    payload = {
      ...payload,
      offer_price: payload.offer_price || 0,
      dimensions: payload.dimensions || dimensions,
      published: true,
      owner_id: id,
      variations: payload.variations.map((variation) => {
        return {
          ...variation,
          sku: variation.sku || `${payload.name}-${variation.size}-${id}`,
        };
      }),
    };
    return await productsRepository.createProduct(payload, id);
  }

  async getProductById(id) {
    return await productsRepository.getProductById(id);
  }

  async getProducts(search, limit, offset, owner_id) {
    if (owner_id == undefined) {
      if (search) {
        return await productsRepository.getProductByFilter(
          search,
          limit,
          offset
        );
      } else {
        return await productsRepository.getProducts(limit, offset);
      }
    } else {
      return await productsRepository.getProductByOwner(
        owner_id,
        limit,
        offset
      );
    }
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

  async getProductByOwner(owner_id, limit, offset) {
    return await productsRepository.getProductByOwner(owner_id, limit, offset);
  }

  async getProductWithAlgolia(search, limit, offset) {
    return await productsRepository.getProductWithAlgolia(
      search,
      limit,
      offset
    );
  }
}

module.exports = ProductsServices;
