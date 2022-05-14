const joi = require('joi');

const image = joi.string().uri();
const name = joi.string().uri();
const id = joi.string().alphanum.min(27).max(28);

const createCategory = joi.object({
  image: image.required(),
  name: name.required(),
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
