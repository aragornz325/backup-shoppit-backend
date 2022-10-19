const joi = require('joi');

const question = joi.string().min(3).max(255);
const answer = joi.string().min(3).max(255);

const createQuestion = joi.object({
  question: question.required(),
});

const updateQuestion = joi.object({
  answer: answer.required(),
});

module.exports = {
  createQuestion,
  updateQuestion,
};
