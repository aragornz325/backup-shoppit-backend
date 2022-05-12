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
const id = joi.string().alphanum().min(27).max(28);
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
  vendor_id: joi.string().alphanum(),
});
const volumen = joi.number();
const weight = joi.number();
const width = joi.number();
const withError = joi.boolean();


const createProduct = joi.object({
  available_colors: available_colors.required(),
  available_size: available_size.required(),
  categories: categories.required(),
  description: description.required(),
  featured: featured.required(),
  featuredImage: featuredImage.required(),
  freeShipping: freeShipping.required(),
  height: height.required(),
  id: id.required(),
  images: images.required(),
  in_stock: in_stock.required(),
  is_published: is_published.required(),
  longitude: longitude.required(),
  manage_colors: manage_colors.required(),
  manage_size: manage_size.required(),
  manage_stock: manage_stock.required(),
  name: name.required(),
  origin: origin.required(),
  permalink: permalink.required(),
  plataform: plataform.required(),
  price: price.required(),
  productAttributes: productAttributes.required(),
  quantity_to_cart: quantity_to_cart.required(),
  regular_price: regular_price.required(),
  sale_price: sale_price.required(),
  selected_variation: selected_variation.required(),
  sku: sku.required(),
  status: status.required(),
  stock_quantity: stock_quantity.required(),
  short_description: short_description.required(),
  tags: tags.required(),
  total_sales: total_sales.required(),
  type: type.required(),
  updated: updated.required(),
  variable_products: variable_products.required(),
  vendor: vendor.required(),
  volumen: volumen.required(),
  weight: weight.required(),
  width: width.required(),
  withError: withError.required(),
});

const updateProduct = joi.object({
  available_colors: available_colors,
  available_size: available_size,
  categories: categories,
  description: description,
  featured: featured,
  featuredImage: featuredImage,
  freeShipping: freeShipping,
  height: height,
  id: id,
  images: images,
  in_stock: in_stock,
  is_published: is_published,
  longitude: longitude,
  manage_colors: manage_colors,
  manage_size: manage_size,
  manage_stock: manage_stock,
  name: name,
  origin: origin,
  permalink: permalink,
  plataform: plataform,
  price: price,
  productAttributes: productAttributes,
  quantity_to_cart: quantity_to_cart,
  regular_price: regular_price,
  sale_price: sale_price,
  selected_variation: selected_variation,
  sku: sku,
  status: status,
  stock_quantity: stock_quantity,
  short_description: short_description,
  tags: tags,
  total_sales: total_sales,
  type: type,
  updated: updated,
  variable_products: variable_products,
  vendor: vendor,
  volumen: volumen,
  weight: weight,
  width: width,
  withError: withError,
});


module.exports = {
  createProduct,
  updateProduct,
};
