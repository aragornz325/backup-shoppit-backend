/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
const joi = require('joi')

const available_colors = joi.string();
const available_size = joi.string();
const categories = joi.string();
const description = joi.string();
const featured = joi.boolean();
const featuredImage = joi.string().uri();
const freeShipping = joi.boolean();
const height = joi.number();
const id = joi.string().alphanum();
const images = joi.array().items(joi.string().uri());
const in_stock = joi.boolean();
const is_published = joi.boolean();
const longitude = joi.number();
const manage_colors = joi.boolean();
const manage_size = joi.boolean();
const manage_stock = joi.boolean();
const name = joi.string().max(40);
const origin = joi.string().max(20);
const permalink = joi.string().uri();
const plataform = joi.string().max(5);
const price = joi.number().integer().positive();
const productAttributes = joi.string();
const quantity_to_cart = joi.string();
const regular_price = joi.number().integer().positive();
const sale_price = joi.number().integer().positive();
const selected_variation = joi.string();
const sku = joi.number();
const status = joi.string();
const stock_quantity = joi.number().positive();
const short_description = joi.string().max(250);
const tags = joi.array();
const total_sales = joi.number();
const type = joi.string();
const updated = joi.array();
const variable_products= joi.array();
const vendor = joi.object({
  minimum_purchase: joi.number(),
  name: joi.string(),
  picture: joi.string(),
  storeName: joi.string(),
  vendor_id: joi.string.alphanum(),
});
const volumen = joi.number();
const weight = joi.number();
const width = joi.number();
const withError = joi.boolean();


const createProduct = joi.object({
  available_colors,
  available_size,
  categories,
  description,
  featured,
  featuredImage,
  freeShipping,
  height,
  id,
  images,
  in_stock,
  is_published,
  longitude,
  manage_colors,
  manage_size,
  manage_stock,
  name,
  origin,
  permalink,
  plataform,
  price,
  productAttributes,
  quantity_to_cart,
  regular_price,
  sale_price,
  selected_variation,
  sku,
  status,
  stock_quantity,
  short_description,
  tags,
  total_sales,
  type,
  updated,
  variable_products,
  vendor,
  volumen,
  weight,
  width,
  withError,
});

module.exports = {
  createProduct,
};
