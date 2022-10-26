const joi = require('joi');

const name = joi.string();
const type = joi.string().valid('simple', 'grouped', 'external', 'variable');
const regular_price = joi.string();
const description = joi.string();
const short_description = joi.string().max(120);
const categories = joi.array().items({
  id: joi.number().required(),
});
const images = joi.array().items({
  src: joi.string().required(),
});
const slug = joi.string();
const status = joi.string().valid('draft', 'pending', 'private', 'publish');
const featured = joi.boolean();
const catalog_visibility = joi
  .string()
  .valid('visible', 'catalog', 'search', 'hidden');
const sku = joi.string();
const price = joi.string();
const sale_price = joi.string();
const date_on_sale_from = joi.date();
const date_on_sale_to = joi.date();
const date_on_sale_to_gmt = joi.date();
const virtual = joi.boolean();
const downloadable = joi.boolean();
const download_limit = joi.number();
const download_expiry = joi.number();
const external_url = joi.string();
const button_text = joi.string();
const tax_status = joi.string().valid('taxable', 'shipping', 'none');
const tax_class = joi.string();
const manage_stock = joi.boolean();
const stock_quantity = joi.number();
const stock_status = joi.string().valid('instock', 'outofstock', 'onbackorder');
const backorders = joi.string().valid('no', 'notify', 'yes');
const sold_individually = joi.boolean();
const weight = joi.string();
const dimensions = joi.object({
  length: joi.string(),
  width: joi.string(),
  height: joi.string(),
});
const shipping_class = joi.string();
const reviews_allowed = joi.boolean();
const upsell_ids = joi.array().items({
  id: joi.number().required(),
});
const cross_sell_ids = joi.array().items({
  id: joi.number().required(),
});
const parent_id = joi.number();
const purchase_note = joi.string();
const tag = joi.array().items({
  id: joi.number().required(),
});
const attributes = joi.array().items({
  id: joi.number().required(),
  name: joi.string().required(),
  slug: joi.string().required(),
  type: joi.string().required(),
  order_by: joi
    .string()
    .valid('menu_order', 'name', 'name_num', 'id')
    .required(),
  has_archives: joi.boolean().required(),
});

const createProductWC = joi.object({
  name: name.required(),
  type: type.required(),
  regular_price: regular_price.required(),
  description: description.required(),
  short_description: short_description.required(),
  categories: categories.required(),
  images: images.required(),
  stock_quantity: stock_quantity,
  weight: weight,
  dimensions: dimensions,
});

const updateProductWC = joi.object({
  name: name,
  type: type,
  regular_price: regular_price,
  description: description,
  short_description: short_description,
  categories: categories,
  images: images,
  slug: slug,
  status: status,
  featured: featured,
  catalog_visibility: catalog_visibility,
  sku: sku,
  price: price,
  sale_price: sale_price,
  date_on_sale_from: date_on_sale_from,
  date_on_sale_to: date_on_sale_to,
  date_on_sale_to_gmt: date_on_sale_to_gmt,
  virtual: virtual,
  downloadable: downloadable,
  download_limit: download_limit,
  download_expiry: download_expiry,
  external_url: external_url,
  button_text: button_text,
  tax_status: tax_status,
  tax_class: tax_class,
  manage_stock: manage_stock,
  stock_quantity: stock_quantity,
  stock_status: stock_status,
  backorders: backorders,
  sold_individually: sold_individually,
  weight: weight,
  dimensions: dimensions,
  shipping_class: shipping_class,
  reviews_allowed: reviews_allowed,
  upsell_ids: upsell_ids,
  cross_sell_ids: cross_sell_ids,
  parent_id: parent_id,
  purchase_note: purchase_note,
  tag: tag,
  attributes: attributes,
});

module.exports = {
  createProductWC,
  updateProductWC,
};
