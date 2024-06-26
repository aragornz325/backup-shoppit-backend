const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const GoogleSheetsRepository = require('../repositories/googleSheet.repository');
const QuestionRepository = require('../repositories/question.repository');
const questionRepository = new QuestionRepository();
const CategoriesRepository = require('../repositories/categories.repositories');
const categoriesRepository = new CategoriesRepository();

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
    const questions = await questionRepository.getQuestionsByProductId(id);
    product[0].questions = questions;
    return product;
  }

  async getProducts(limit, offset) {
    return await productsRepository.getProducts(limit, offset);
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
    const newCategory = await categoriesRepository.getCategoryByName(category);

    return await productsRepository.getProductsByCategory(
      newCategory.id,
      limit,
      offset
    );
  }
  async getProductsByCategoryAndSearch(search, category, limit, offset) {
    const newCategory = await categoriesRepository.getCategoryByName(category);

    return await productsRepository.getProductsByCategoryAndSearch(
      search,
      newCategory.id,
      limit,
      offset
    );
  }
}

module.exports = ProductsServices;
