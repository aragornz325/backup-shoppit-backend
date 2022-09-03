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

class CheckoutServices {
  async createOrder1(order) {
    // check if user exists
    await userRepository.getUserById(order.owner_id);

    // calculate total quantity
    let total_quantity = 0;
    for (let i = 0; i < order.products_list.length; i++) {
      total_quantity += order.products_list[i].quantity;
    }

    // calculate total amount
    let amount = 0;
    for (let i = 0; i < order.products_list.length; i++) {
      const prioductDb = await productsRepository.getProductById(
        order.products_list[i].product_id
      );
      amount += prioductDb[0].regular_price * order.products_list[i].quantity;
    }

    // create order
    const order_items = order.products_list.map((product) => {
      return {
        product_id: product.product_id,
        quantity: product.quantity,
        status_by_seller: 'pending',
        status_by_buyer: 'approved',
      };
    });

    const orderToDb = {
      owner_id: order.owner_id,
      order_items,
      total_price: amount,
      total_quantity: total_quantity,
      created_at: Math.floor(Date.now() / 1000),
      status: 'pending',
    };

    //save order to db
    await checkoutRepository.createOrder(orderToDb);

    //set user cart to empty
    const cart = {
      owner_id: order.owner_id,
      products_list: [],
      total_quantity: 0,
      total_price: 0,
    };
    const check_cart = await cartsRepository.getCartByOwner(order.owner_id);
    if (check_cart.length <= 0) {
      await cartsRepository.createCart(cart);
    } else {
      await cartsRepository.setCart(cart, check_cart[0].id, false);
    }
    return { msg: 'ok' };
  }

  async createOrder(order) {
    const productsByIdMap = new Map();
    for (let i = 0; i < order.products_list.length; i++) {
      if (!productsByIdMap.has(order.products_list[i].product_id)) {
        let varitionsMap = new Map();
        varitionsMap.set(
          order.products_list[i].variation,
          order.products_list[i].quantity
        );
        productsByIdMap.set(order.products_list[i].product_id, varitionsMap);
      } else {
        let variationsMap = productsByIdMap.get(
          order.products_list[i].product_id
        );
        if (!variationsMap.has(order.products_list[i].variation)) {
          variationsMap.set(
            order.products_list[i].variation,
            order.products_list[i].quantity
          );
        } else {
          let quantity = variationsMap.get(order.products_list[i].variation);
          variationsMap.set(
            order.products_list[i].variation,
            quantity + order.products_list[i].quantity
          );
        }
      }
    }
    //create orders from productsByIdMap
    const order_items = [];
    for (let product_id of productsByIdMap.keys()) {
      const product = await productsRepository.getProductById(product_id);
      const variationsMap = productsByIdMap.get(product_id);
      for (let variation of variationsMap.keys()) {
        const quantity = variationsMap.get(variation);
        order_items.push({
          product_id,
          variation,
          quantity,
          status_by_seller: 'pending',
          status_by_buyer: 'approved',
        });
      }
    }

    const ordersBySellerMap = new Map();
    for (let i = 0; i < order_items.length; i++) {
      const order_item = order_items[i];
      const product = await productsRepository.getProductById(
        order_item.product_id
      );
      const seller_id = product[0].owner_id;
      if (!ordersBySellerMap.has(seller_id)) {
        let order_items = [];
        order_items.push(order_item);
        ordersBySellerMap.set(seller_id, order_items);
      } else {
        let order_items = ordersBySellerMap.get(seller_id);
        order_items.push(order_item);
        ordersBySellerMap.set(seller_id, order_items);
      }
    }
    //create orders from ordersBySellerMap
    let finalOrders = [];
    for (let seller_id of ordersBySellerMap.keys()) {
      const order_items = ordersBySellerMap.get(seller_id);
      let total_quantity = 0;
      let total_price = 0;
      for (let i = 0; i < order_items.length; i++) {
        const order_item = order_items[i];
        const product = await productsRepository.getProductById(
          order_item.product_id
        );

        total_quantity += order_item.quantity;

        total_price += product[0].regular_price * order_item.quantity;
      }
      const orderToDb = {
        seller_id,
        owner_id: order.owner_id,
        order_items,
        total_price,
        total_quantity,
        created_at: Math.floor(Date.now() / 1000),
        status: 'pending',
      };

      finalOrders.push(orderToDb);
    }
    return finalOrders;
  }
}
module.exports = CheckoutServices;
