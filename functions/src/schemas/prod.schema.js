const joi = require('joi');

const category = joi.string();
const color = joi.string().max(20);
const currency = joi.string().valid('ARS', 'USD', 'BRL', 'PYG').default('ARS');
const description = joi.string().max(255);
const features = joi.string().max(255);
const height = joi.number().positive();
const id = joi.string().alphanum(); //TODO: requiere confirmacion del largo del ID
const image_url = joi.array().items(joi.string().uri());
const images_url = joi.array();
const is_published = joi.boolean();
const longitude = joi.number().positive();
const min_sell_amount = joi.number().integer();
const name = joi.string().max(40);
const offer_price = joi.number().positive();
const publish = joi.boolean();
const quantity = joi.number().integer();
const regular_price = joi.number().integer();
const size = joi.string();
const sku = joi.string();
const state = joi.string().valid('new', 'used');
const stock_XS = joi.number().integer().positive();
const stock_S = joi.number().integer().positive();
const stock_M = joi.number().integer().positive();
const stock_L = joi.number().integer().positive();
const stock_XL = joi.number().integer().positive();
const total_stock = joi.number().positive();
const thumbnail = joi.string().uri();
const variation = joi.string().min(3).max(15);
const weight = joi.number().positive();
const width = joi.number().positive();

const variations = joi.array().items({
  variation: variation.required(),
  color: color.required(),
  size: size.required(),
  quantity: quantity.required(),
  sku,
});

const dimensions = joi.object({
  height,
  width,
  longitude,
  weight,
});

const createProduct = joi.object({
  name: name.required(),
  description: description.required(),
  regular_price: regular_price.required(),
  state,
  variations,
  images_url,
  category: category.required(),
  offer_price,
  min_sell_amount: min_sell_amount.required(),
  dimensions,
  currency,
  features: features.required(),
  thumbnail: thumbnail.required(),
});

const validateSheetsProduct = joi.object({
  name: name.required(),
  offer_price: offer_price.required(),
  regular_price: regular_price.required(),
  description: description.required(),
  image_url: image_url.required(),
  height: height.required(),
  width: width.required(),
  weight: weight.required(),
  longitude: longitude.required(),
  sku: sku.required(),
  stock_XS: stock_XS.required(),
  stock_S: stock_S.required(),
  stock_M: stock_M.required(),
  stock_L: stock_L.required(),
  stock_XL: stock_XL.required(),
});

const validateItem = joi
  .array()
  .items(
    name,
    offer_price,
    regular_price,
    description,
    image_url,
    height,
    width,
    weight,
    longitude,
    sku,
    stock_XS,
    stock_S,
    stock_M,
    stock_L,
    stock_XL
  );
const updateProduct = joi.object({
  name,
  description,
  regular_price,
  state,
  variations,
  images_url,
  total_stock,
  sku,
  category,
  publish,
  offer_price,
  min_sell_amount,
  dimensions,
});

const getOne = joi.object({
  id: id.required(),
});

module.exports = {
  createProduct,
  updateProduct,
  getOne,
  validateItem,
};
