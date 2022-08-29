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
  async createOrder(order) {
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
}

module.exports = CheckoutServices;
