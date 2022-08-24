const joi = require('joi');

const owner_id = joi.string().required();
const products_list = joi.array().items(
  joi.object().keys({
    product_id: joi.string().required(),
    quantity: joi.number().required(),
  })
);
const created_at = joi.number();
const updated_at = joi.number();

const cartSchema = joi.object().keys({
  owner_id,
  products_list,
});

const cartUpdateSchema = joi.object().keys({
  owner_id,
  products_list,
  created_at,
  updated_at,
});

module.exports = {
  cartSchema,
  cartUpdateSchema,
};
