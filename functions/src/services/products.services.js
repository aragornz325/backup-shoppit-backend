const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const GoogleSheetsRepository = require('../repositories/googleSheet.repository');
const QuestionRepository = require('../repositories/question.repository');
const questionRepository = new QuestionRepository();

const googleSheetsRepository = new GoogleSheetsRepository();

class ProductsServices {
  async createProduct(payload, id) {
    const dimensions = {
      width: 0,
      height: 0,
      longitude: 0,
      weight: 0,
    };
    payload = {
      ...payload,
      is_valid: true,
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
    const product = await productsRepository.getProductById(id);
    const questions = await questionRepository.get5QuestionsByProductId(id);
    product[0].questions = questions;
    return product;
  }

  async getProducts(search, category, limit, offset, owner_id) {
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

  async getProductsByCategory(category, limit, offset) {
    return await productsRepository.getProductsByCategory(
      category,
      limit,
      offset
    );
  }
  async getProductsByCategoryAndSearch(category, search, limit, offset) {
    return await productsRepository.getProductsByCategoryAndSearch(
      category,
      search,
      limit,
      offset
    );
  }
}

module.exports = ProductsServices;
