/* eslint-disable new-parens */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createQuestionDTO,
  updateQuestionDTO,
  getQuestionDTO,
} = require('../schemas/faqs.schema'); /* DTOs */
const { 
    createQuestion,
    updateQuestion,
    getQuestion,
    getOneQuestion,
    deleteQuestion,} = require('./faqs.controller');

const faqsRoutes = (app) => {
  app.get('/faqs', getQuestion);
  app.post('/faqs', validatorHandler(createQuestionDTO, 'body'), createQuestion);
  app.get('/faqs/:id', validatorHandler(getQuestionDTO, 'params'), getOneQuestion);
  app.patch('/faqs/:id', validatorHandler(getQuestionDTO, 'params'), validatorHandler(updateQuestionDTO, 'body'), updateQuestion);
  app.delete('/faqs/:id', validatorHandler(getQuestionDTO, 'params'), deleteQuestion);
};

module.exports = {
    faqsRoutes,
};
