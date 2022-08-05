const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const GoogleSheetsRepository = require('../repositories/googleSheet.repository');

const googleSheetsRepository = new GoogleSheetsRepository();

class ProductsServices {
  async createProduct(payload, id) {
    payload = {
      ...payload,
      owner_id: id,
      published: true,
      variations: payload.variations.map((variation) => {
        for (let i = 0; i < variation.sizes.length; i++) {
          return {
            variation: variation.variation,
            color: variation.color,
            size: variation.sizes[i].size,
            quantity: parseInt(variation.sizes[i].quantity[i], 10),
            sku:
              variation.sizes.sku ||
              `${payload.name}-${variation.color}-${variation.sizes[i].size}-${id}`,
          };
        }
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
}

module.exports = ProductsServices;
