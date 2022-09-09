const joi = require('joi');

const question = joi.string().min(3).max(255);
const answer = joi.string().min(3).max(255);
const user_id = joi.string().alphanum();

const createQuestion = joi.object({
  question: question.required(),
  user_id: user_id.required(),
});

const updateQuestion = joi.object({
  answer: answer.required(),
  user_id: user_id.required(),
});

module.exports = {
  createQuestion,
  updateQuestion,
};
