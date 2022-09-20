const { db } = require('../../config/firebase');
const CheckoutRepository = require('../repositories/checkout.repository');
const checkoutRepository = new CheckoutRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const CartsRepository = require('../repositories/carts.repositories');
const cartsRepository = new CartsRepository();
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class CheckoutServices {
  async createOrder(order) {
    const checkUser = await userRepository.getUserById(order.owner_id);
    if (!checkUser) {
      throw boom.badRequest(`User ${order.owner_id} not found`);
    }
    for (let i = 0; i < order.products_list.length; i++) {
      const product = await productsRepository.getProductById(
        order.products_list[i].product_id
      );
      if (product[0].length < 0 || !product[0]) {
        throw boom.badRequest(`Product not found ${product[0].id}`);
      }

      const productsByIdMap = new Map();
      functions.logger.info('seting products map by id and sku');

      for (let i = 0; i < order.products_list.length; i++) {
        if (!productsByIdMap.has(order.products_list[i].product_id)) {
          let varitionsMap = new Map();
          varitionsMap.set(
            order.products_list[i].sku,
            order.products_list[i].quantity
          );
          productsByIdMap.set(order.products_list[i].product_id, varitionsMap);
        } else {
          let variationsMap = productsByIdMap.get(
            order.products_list[i].product_id
          );
          if (!variationsMap.has(order.products_list[i].sku)) {
            variationsMap.set(
              order.products_list[i].sku,
              order.products_list[i].quantity
            );
          } else {
            let quantity = variationsMap.get(order.products_list[i].sku);
            variationsMap.set(
              order.products_list[i].sku,
              quantity + order.products_list[i].quantity
            );
          }
        }
      }

      let ids = [...productsByIdMap.keys()];
      const productFromDb = await productsRepository.getProductsByIds(ids);

      functions.logger.info('creating order');
      const ordersByOwner = new Map();

      for (let i = 0; i < productFromDb.length; i++) {
        const product = productFromDb[i];
        console.log('owner id------------->', product.owner_id);
        if (!ordersByOwner.has(product.owner_id)) {
          let variationMap = productsByIdMap.get(product.id);
          let newOrder = {
            owner_id: order.owner_id,
            seller_id: product.owner_id,
            created_at: Math.floor(Date.now() / 1000),
            status: 'pending',
            order_items: [],
          };
          for (let [sku, quantity] of variationMap) {
            let orderItem = {
              product_id: product.id,
              quantity,
              price: product.regular_price,
              status_by_buyer: 'approved',
              status_by_seller: 'pending',
              sku: sku,
            };
            newOrder.order_items.push(orderItem);
          }
          ordersByOwner.set(product.owner_id, newOrder);
        } else {
          let variationMap = productsByIdMap.get(product.id);
          let order = ordersByOwner.get(product.owner_id);
          for (let [sku, quantity] of variationMap) {
            let orderItem = {
              product_id: product.id,
              quantity,
              price: product.regular_price,
              status_by_buyer: 'approved',
              status_by_seller: 'pending',
              sku: sku,
            };
            order.order_items.push(orderItem);
          }
          ordersByOwner.set(product.owner_id, order);
        }
      }
      //calculate total quantity and total price
      functions.logger.info('calculate total quantity and total price');
      for (let [key, value] of ordersByOwner) {
        let totalQuantity = 0;
        let totalPrice = 0;
        for (let i = 0; i < value.order_items.length; i++) {
          totalQuantity += value.order_items[i].quantity;
          totalPrice +=
            value.order_items[i].quantity * value.order_items[i].price;
        }
        value.total_quantity = totalQuantity;
        value.total_price = totalPrice;
      }
      // create order in db
      functions.logger.info('create order in db');
      for (let [key, value] of ordersByOwner) {
        console.log(value);
        await checkoutRepository.createOrder(value);
      }
      // set empty cart
      functions.logger.info('seting cart to empty');
      await cartsRepository.setEmptyCart(order.owner_id);
      return { message: 'Order created successfully' };
    }
  }
}
module.exports = CheckoutServices;
