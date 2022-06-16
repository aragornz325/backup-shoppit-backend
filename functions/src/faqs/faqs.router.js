const express = require('express');
const router = express.Router();
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
  deleteQuestion,
} = require('./faqs.controller');
const { chequearRoles } = require('../middlewares/auth.handler');

router.get('/', getQuestion);
router.post(
  '/',
  chequearRoles('customer', 'seller'),
  validatorHandler(createQuestionDTO, 'body'),
  createQuestion
);
router.get('/:id', validatorHandler(getQuestionDTO, 'params'), getOneQuestion);
router.patch(
  '/:id',
  validatorHandler(getQuestionDTO, 'params'),
  validatorHandler(updateQuestionDTO, 'body'),
  updateQuestion
);
router.delete(
  '/:id',
  validatorHandler(getQuestionDTO, 'params'),
  deleteQuestion
);

module.exports = router;
