const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const GoogleSheetsRepository = require('../repositories/googleSheet.repository');
const QuestionRepository = require('../repositories/question.repository');
const questionRepository = new QuestionRepository();
const CategoriesRepository = require('../repositories/categories.repositories');
const categoriesRepository = new CategoriesRepository();
// const WooCommerceRepository = require('../repositories/wooComerce.repository');
// const wooCommerceRepository = new WooCommerceRepository();
const functions = require('firebase-functions');

const googleSheetsRepository = new GoogleSheetsRepository();

class ProductsServices {
  async createProduct(payload) {
    return await productsRepository.createProduct(payload);
  }

  async getProductByName(name) {
    return await productsRepository.getProductByName(name);
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
    const productList = await googleSheetsRepository.getProduct(id, userId);
    console.log(productList);
    for (let i = 0; i < productList.length; i++) {
      try {
        await wooCommerceRepository.createProduct(productList[i]);
      } catch (error) {
        functions.logger.error('error', error);
      }
    }
    return { msg: 'ok' };
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

  async getProductsByCategory(id, limit, offset) {
    return await productsRepository.getProductsByCategory(id, limit, offset);
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
