const joi = require('joi');

const image = joi.string().uri();
const name = joi.string();
const id = joi.string().alphanum().min(20).max(20);
const description = joi.string();

const createCategory = joi.object({
  image: image.required(),
  name: name.required(),
  description: description.required(),
});

const updateCategory = joi.object({
  image,
  name,
});

const getOnecategory = joi.object({
  id: id.required(),
});

module.exports = {
  createCategory,
  updateCategory,
  getOnecategory,
};
