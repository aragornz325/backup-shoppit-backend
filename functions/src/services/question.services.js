const QuestionRepository = require('../repositories/question.repository');
const questionRepository = new QuestionRepository();
const ProductRepository = require('../repositories/products.repository');
const productRepository = new ProductRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();

class QuestionServices {
  async createQuestion(payload, productId, user_id) {
    const checkUser = await userRepository.getUserById(user_id);
    if (!checkUser) {
      throw new Error('User not found');
    }
    const product = await productRepository.getProductById(productId);
    const seller_id = product[0].owner_id;
    const questionPayload = {
      seller_id,
      question: payload.question || null,
      answer: payload.answer || null,
      created_at: Math.floor(Date.now() / 1000),
      user_id: user_id || null,
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

  async updateQuestion(payload, questionId) {
    await questionRepository.getQuestionById(questionId);
    const questionPayload = {
      answer: payload.answer,
      updated_at: Math.floor(Date.now() / 1000),
    };
    await questionRepository.updateQuestion(questionPayload, questionId);
    return { msg: 'ok' };
  }

  async getQuestionsBySellerId(seller_id) {
    const questions = await questionRepository.getQuestionsBySellerId(
      seller_id
    );
    return questions;
  }
}

module.exports = QuestionServices;
