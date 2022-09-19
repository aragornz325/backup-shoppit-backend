const { db } = require('../../config/firebase');
const functions = require('firebase-functions');

const boom = require('@hapi/boom');
const ProductsRepository = require('./products.repository');

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

  async getCartByOwner(owner_id) {
    const cart = {};
    const cartRef = await db
      .collection('carts')
      .where('owner_id', '==', owner_id)
      .get();
    if (cartRef.empty) {
      functions.logger.info('No matching cart.');
      return {};
    }
    cartRef.forEach((doc) => {
      cart.id = doc.id;
      cart.owner_id = doc.data().owner_id;
      cart.products_list = doc.data().products_list;
      cart.total_price = doc.data().total_price;
      cart.total_quantity = doc.data().total_quantity;
      cart.created_at = doc.data().created_at;
    });
    return cart;
  }

  async setEmptyCart(user_id) {
    const cartRef = await db
      .collection('carts')
      .where('owner_id', '==', user_id)
      .get();
    if (!cartRef.exists) {
      await db.collection('carts').add({
        owner_id: user_id,
        products_list: [],
        total_price: '',
        total_quantity: '',
        created_at: Math.floor(Date.now() / 1000),
      });
    } else {
      await db.collection('carts').doc(cartRef.id).update({
        products_list: [],
        total_price: '',
        total_quantity: '',
      });
    }
    return { msg: 'ok' };
  }

  async getCartByOwnerId(owner_id) {
    const cart = await db
      .collection('carts')
      .where('owner_id', '==', owner_id)
      .get();
    if (cart.empty) {
      functions.logger.info('Cart not found');
      return {};
    }
    return { ...cart.docs[0].data(), id: cart.docs[0].id };
  }

  async deleteCartByOwnerId(owner_id) {
    const cart = await db
      .collection('carts')
      .where('owner_id', '==', owner_id)
      .get();
    if (cart.empty) {
      functions.logger.log('Cart not found');
      return { msg: 'ok' };
    }
    await db.collection('carts').doc(cart.docs[0].id).delete();
    functions.logger.log('Carts deleted');
    return { msg: 'ok' };
  }

  async deleteProductFromCartByUserId(user_id, seller_id) {
    const cart = await db
      .collection('carts')
      .where('owner_id', '==', user_id)
      .get();
    if (cart.empty) {
      functions.logger.info('Cart not found');
      await db.collection('carts').add({
        owner_id: user_id,
        products_list: [],
        total_price: '',
        total_quantity: '',
        created_at: Math.floor(Date.now() / 1000),
      });
      return { msg: 'ok' };
    }
    const cartId = cart.docs[0].id;
    const cartData = cart.docs[0].data();
    const productsList = cartData.products_list;
    const newProductsList = [];
    for (let i = 0; i < productsList.length; i++) {
      const product = await db
        .collection('products')
        .doc(productsList[i].product_id)
        .get();
      if (product.data().owner_id !== seller_id) {
        newProductsList.push(productsList[i]);
      }
    }
    let total_quantity = 0;
    let amount = 0;
    newProductsList.forEach((product) => {
      total_quantity += product.quantity;
    });
    for (let i = 0; i < newProductsList.length; i++) {
      const product = await db
        .collection('products')
        .doc(newProductsList[i].product_id)
        .get();
      amount += product.data().regular_price * newProductsList[i].quantity;
    }
    await db
      .collection('carts')
      .doc(cartId)
      .update({
        products_list: newProductsList,
        total_quantity,
        amount,
        updated_at: Math.floor(Date.now() / 1000),
      });
    return { msg: 'ok' };
  }
}
module.exports = CartsRepository;
