const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class CartsRepository {
  async createCart(payload) {
    await db.collection('carts').add(payload);
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
