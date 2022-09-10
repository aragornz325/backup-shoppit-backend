const CartsRepository = require('../repositories/carts.repositories');
const cartsRepository = new CartsRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');

class CartsServices {
  async createCart(payload) {
    const checkUser = await userRepository.getUserById(payload.owner_id);
    if (!checkUser) {
      throw boom.notFound('User not found');
    }
    const checkCart = await cartsRepository.getCartByOwner(payload.owner_id);

    if (checkCart.length > 0 && checkCart[0].products_list.length > 0) {
      throw boom.conflict('user already have open cart');
    }
    let total_quantity = 0;

    for (let i = 0; i < payload.products_list.length; i++) {
      total_quantity += payload.products_list[i].quantity;
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
      created_at: Math.floor(Date.now() / 1000),
    };

    return await cartsRepository.createCart(cart);
  }

  async getAllCarts() {
    return await cartsRepository.getAllCarts();
  }

  async updateCart(payload, cart_id) {
    let total_quantity = 0;
    let amount = 0;

    if (payload.products_list.length == 1) {
      total_quantity = payload.products_list[0].quantity;
    } else {
      for (let i = 0; i < payload.products_list.length; i++) {
        total_quantity += payload.products_list[i].quantity;
      }
    }
    for (let i = 0; i < payload.products_list.length; i++) {
      const prioductDb = await db
        .collection('products')
        .doc(payload.products_list[i].product_id)
        .get();
      amount +=
        prioductDb.data().regular_price * payload.products_list[i].quantity;
    }
    const cartUpdate = {
      ...payload,
      total_price: amount,
      total_quantity: total_quantity,
      updated_at: Math.floor(Date.now() / 1000),
    };

    await cartsRepository.setCart(cartUpdate, cart_id, false);
    return { msg: 'ok' };
  }

  async getCartById(cart_id) {
    const cart = await cartsRepository.getCartById(cart_id);
    let cartToFront = {};
    const newCart = await this.dtoGetCart(cart);
    cartToFront = { ...newCart };
    return cartToFront;
  }

  async deleteCart(cart_id) {
    return await cartsRepository.deleteCart(cart_id);
  }

  async getCartByOwnerId(owner_id) {
    const carts = await cartsRepository.getCartByOwner(owner_id);
    let cartToFront = {};
    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      const newCart = await this.dtoGetCart(cart);
      cartToFront = { ...newCart };
    }
    return cartToFront;
  }

  async dtoGetCart(cart) {
    const owner = await userRepository.getUserById(cart.owner_id);
    const products_list = [];
    for (const product of cart.products_list) {
      const productData = await productsRepository.getProductById(
        product.product_id
      );
      const variationfilterd = productData[0].variations.filter(
        (variation) => variation.variation === product.variation
      );
      const details = variationfilterd[0];
      products_list.push({
        ...details,
        name: productData[0].name,
        product_id: product.product_id,
        quantity: product.quantity,
        varition: product.variation,
        price: product.price || productData.price,
        picture: productData[0].images_url[0] || '',
      });
    }
    return {
      id: cart.id,
      owner_id: owner.id,
      owner_name: owner.name,
      owner_email: owner.email,
      products_list: products_list,
      total_price: cart.total_price,
      total_quantity: cart.total_quantity,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };
  }
}

module.exports = CartsServices;
