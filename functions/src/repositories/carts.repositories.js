const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class CartsRepository {
  async createCart(payload) {
    let total_quantity = 0;
    if (payload.products_list.length == 1) {
      total_quantity = payload.products_list[0].quantity;
    } else {
      for (let i = 0; i < payload.products_list.length; i++) {
        total_quantity += payload.products_list[i].quantity;
      }
    }
    let amount = 0;
    for (let i = 0; i < payload.products_list.length; i++) {
      const prioductDb = await db
        .collection('products')
        .doc(payload.products_list[i].product_id)
        .get();
      amount +=
        prioductDb.data().regular_price * payload.products_list[i].quantity;
    }

    const cart = {
      owner_id: payload.owner_id,
      products_list: payload.products_list,
      total_price: amount,
      total_quantity: total_quantity,
    };

    await db.collection('carts').add(cart);
    return { msg: 'ok' };
  }

  async getAllCarts() {
    const carts = await db.collection('carts').get();
    const cartsList = [];
    carts.forEach((doc) => {
      cartsList.push(doc.data());
    });
    return cartsList;
  }

  updateCart(payload) {
    return db.collection('carts').doc(payload.cart_id).update(payload);
  }
}

module.exports = CartsRepository;
