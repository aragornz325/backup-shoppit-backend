const CartsRepository = require('../repositories/carts.repositories');
const cartsRepository = new CartsRepository();
const { db } = require('../../config/firebase');

class CartsServices {
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

    return await cartsRepository.createCart(cart);
  }

  async getAllCarts() {
    return await cartsRepository.getAllCarts();
  }

  async updateCart(payload, cart_id) {
    await cartsRepository.updateCart(payload, cart_id);
    const cart = await cartsRepository.getCartById(cart_id);

    let total_quantity = 0;
    let amount = 0;
    if (cart.products_list.length == 1) {
      total_quantity = cart.products_list[0].quantity;
    } else {
      for (let i = 0; i < cart.products_list.length; i++) {
        total_quantity += cart.products_list[i].quantity;
      }
    }
    for (let i = 0; i < cart.products_list.length; i++) {
      const prioductDb = await db
        .collection('products')
        .doc(cart.products_list[i].product_id)
        .get();
      amount +=
        prioductDb.data().regular_price * cart.products_list[i].quantity;
    }
    const cartUpdate = {
      ...cart,
      total_price: amount,
      total_quantity: total_quantity,
    };
    await cartsRepository.setCart(cartUpdate, cart_id, false);
  }
}

module.exports = CartsServices;
