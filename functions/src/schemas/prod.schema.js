const joi = require('joi');

const isAstroselling = joi.boolean();
const channel_id = joi.number().integer();
const available_colors = joi.string();
const available_size = joi.string();
const category = joi.string().valid('clothes', 'shoes', 'accessories', 'tech');
const color = joi.string().max(20);
const currency = joi.string().min(3).max(3).default('ARS');
const stock = joi.number().integer();
const description = joi.string().max(255);

const featured = joi.boolean();
const featuredImage = joi.string().uri();
const freeShipping = joi.boolean();
const height = joi.number();
const id = joi.string().alphanum(); //TODO: requiere confirmacion del largo del ID
const images = joi.array().items(joi.string().uri());
const images_url = joi.array().items(joi.string().uri());
const in_stock = joi.boolean();
const is_published = joi.boolean();
const longitude = joi.number();
const manage_colors = joi.boolean();
const manage_size = joi.boolean();
const manage_stock = joi.boolean();
const min_sell_amount = joi.number().integer();
const name = joi.string().max(40);
const origin = joi.string().max(20);
const offer_price = joi.number().positive();
const permalink = joi.string().uri();
const plataform = joi.string().max(5);
const price = joi.any();
const productAttributes = joi.string();
const publish = joi.boolean();
const quantity = joi.number().integer();
const quantity_to_cart = joi.string();
const regular_price = joi.number().integer().positive();
const sale_price = joi.number().integer().positive();
const selected_variation = joi.string();
const size = joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL');
const sku = joi.number();
const state = joi.string().valid('new', 'used');
const status = joi.string();
const stock_quantity = joi.number().positive();
const short_description = joi.string().max(250);
const tags = joi.array();
const total_sales = joi.number();
const total_stock = joi.number().positive();
const type = joi.string();
const updated = joi.array();
const variable_products = joi.array();
const variation_type = joi.string().valid('tech', 'clotehs');

const variations = joi.array().items({
  variation_type,
  size,
  color,
  quantity,
});
const vendor = joi.object({
  minimum_purchase: joi.number(),
  name: joi.string(),
  picture: joi.string(),
  storeName: joi.string(),
  vendor_id: joi.string().alphanum(),
});
const volumen = joi.number();
const weight = joi.number();
const width = joi.number();
const withError = joi.boolean();
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
  state: state.required(),
  variations: variations.required(),
  images_url: images_url.required(),
  total_stock: total_stock.required(),
  sku: sku.required(),
  category: category.required(),
  publish: publish.required(),
  offer_price: offer_price.required(),
  min_sell_amount: min_sell_amount.required(),
  dimensions: dimensions.required(),
});

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
};
