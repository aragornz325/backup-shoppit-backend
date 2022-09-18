const QuestionRepository = require('../repositories/question.repository');
const questionRepository = new QuestionRepository();
const ProductRepository = require('../repositories/products.repository');
const productRepository = new ProductRepository();

class QuestionServices {
  async createQuestion(payload, productId) {
    const product = await productRepository.getProductById(productId);
    const sellerId = product[0].owner_id;
    const questionPayload = {
      sellerId: sellerId,
      question: payload.question || null,
      answer: payload.answer || null,
      created_at: Math.floor(Date.now() / 1000),
      user_id: payload.user_id || null,
    };

    const question = await questionRepository.createQuestion(
      questionPayload,
      productId
    );
    return question;
  }

  async getQuestionsByProductId(productId) {
    const questions = await questionRepository.getQuestionsByProductId(
      productId
    );
    return questions;
  }

  async updateQuestion(payload, productId) {
    const questionPayload = {
      answer: payload.answer || null,
      updated_at: Math.floor(Date.now() / 1000),
      user_id: payload.user_id || null,
      questionId: payload.questionId || null,
    };
    const question = await questionRepository.updateQuestion(
      questionPayload,
      productId
    );
    return question;
  }

  async getQuestionsBySellerId(sellerId) {
    const questions = await questionRepository.getQuestionsBySellerId(sellerId);
    return questions;
  }
}

module.exports = QuestionServices;
