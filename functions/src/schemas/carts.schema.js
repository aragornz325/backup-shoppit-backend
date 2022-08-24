const joi = require('joi');

const owner_id = joi.string().required();
const products_list = joi.array().items(
  joi.object().keys({
    product_id: joi.string().required(),
    quantity: joi.number().required(),
  })
);

const cartSchema = joi.object().keys({
  owner_id,
  products_list,
});

module.exports = {
  cartSchema,
};
