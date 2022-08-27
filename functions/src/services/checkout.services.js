const { db } = require('../../config/firebase');
const CheckoutRepository = require('../repositories/checkout.repository');
const checkoutRepository = new CheckoutRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
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
      const prioductDb = await db
        .collection('products')
        .doc(order.products_list[i].product_id)
        .get();
      amount +=
        prioductDb.data().regular_price * order.products_list[i].quantity;
    }

    // create order
    const orderToDb = {
      owner_id: order.owner_id,
      products_list: order.products_list,
      total_price: amount,
      total_quantity: total_quantity,
      created_at: Math.floor(Date.now() / 1000),
      status_by_seller: 'pending',
      status_by_buyer: 'approved',
    };
    const setStatus = await checkoutRepository.changeOrderStatus(orderToDb);

    //save order to db
    await checkoutRepository.createOrder(setStatus);

    return { msg: 'ok' };
  }
}

module.exports = CheckoutServices;
