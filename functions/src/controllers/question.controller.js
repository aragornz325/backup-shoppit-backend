const QuestionServices = require('../services/question.services');
const questionServices = new QuestionServices();

class QuestionRouter {
  async createQuestion(req, res, next) {
    try {
      const productId = req.params.id;
      const payload = req.body;
      const question = await questionServices.createQuestion(
        payload,
        productId
      );
      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  }
  async getQuestionsByProductId(req, res, next) {
    try {
      const productId = req.params.id;
      const questions = await questionServices.getQuestionsByProductId(
        productId
      );
      res.status(200).json(questions);
    } catch (error) {
      next(error);
    }
  }
  async updateQuestion(req, res, next) {
    try {
      const productId = req.params.id;
      const payload = req.body;
      const question = await questionServices.updateQuestion(
        payload,
        productId
      );
      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  }
  async getQuestionsBySellerId(req, res, next) {
    try {
      const sellerId = req.params.id;
      const questions = await questionServices.getQuestionsBySellerId(sellerId);
      res.status(200).json(questions);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = QuestionRouter;
