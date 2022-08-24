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
      cartsList.push({ ...doc.data(), id: doc.id });
    });
    return cartsList;
  }

  async updateCart(payload, cart_id) {
    return db.collection('carts').doc(cart_id).update(payload);
  }

  async getCartById(cart_id) {
    const cart = await db.collection('carts').doc(cart_id).get();
    if (!cart.exists) {
      throw boom.notFound('Cart not found');
    }
    return { ...cart.data(), id: cart.id };
  }

  async setCart(payload, cart_id, merge) {
    await db.collection('carts').doc(cart_id).set(payload, { merge });
    return { msg: 'ok' };
  }

  async deleteCart(cart_id) {
    await db.collection('carts').doc(cart_id).delete();
    return { msg: 'ok' };
  }
}
module.exports = CartsRepository;
