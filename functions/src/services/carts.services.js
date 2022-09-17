const CartsRepository = require('../repositories/carts.repositories');
const cartsRepository = new CartsRepository();
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const ProductsRepository = require('../repositories/products.repository');
const productsRepository = new ProductsRepository();
const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');
const functions = require('firebase-functions');

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

  async updateCart(payload, owner_id) {
    await userRepository.getUserById(owner_id);
    const product = await productsRepository.getProductById(
      payload.products_list[0].product_id
    );
    const checkIfvariationExist = product[0].variations.filter(
      (variation) => variation.sku === payload.products_list[0].sku
    );
    if (checkIfvariationExist.length === 0) {
      throw boom.notFound('variation not found');
    }
    const cart = await cartsRepository.getCartByOwnerId(owner_id);
    if (!cart.owner_id) {
      let cartCreate = {
        owner_id: owner_id,
        products_list: payload.products_list,
        amount: product[0].regular_price * payload.products_list[0].quantity,
        total_quantity: payload.products_list[0].quantity,
        created_at: Math.floor(Date.now() / 1000),
      };
      await cartsRepository.createCart(cartCreate);
      return { msg: 'cart created' };
    } else {
      const checkIfProductExist = cart.products_list.filter(
        (product) =>
          product.product_id === payload.products_list[0].product_id &&
          product.sku === payload.products_list[0].sku
      );

      if (checkIfProductExist.length === 0) {
        let products_list = [...cart.products_list, ...payload.products_list];
        let total_quantity = 0;
        let amount = 0;
        for (let i = 0; i < products_list.length; i++) {
          total_quantity += products_list[i].quantity;
        }
        for (let i = 0; i < products_list.length; i++) {
          const prod = await productsRepository.getProductById(
            products_list[i].product_id
          );
          amount += prod[0].regular_price * products_list[i].quantity;
        }
        const newCart = {
          owner_id: owner_id,
          total_quantity: total_quantity,
          products_list: products_list,
          amount: amount,
          updated_at: Math.floor(Date.now() / 1000),
        };
        await cartsRepository.updateCart(newCart, cart.id);
        return { msg: 'cart updated' };
      } else {
        let products_list = cart.products_list.map((product) => {
          if (
            product.product_id === payload.products_list[0].product_id &&
            product.sku === payload.products_list[0].sku
          ) {
            product.quantity = payload.products_list[0].quantity;
          }
          return product;
        });
        let total_quantity = 0;
        let amount = 0;
        for (let i = 0; i < products_list.length; i++) {
          total_quantity += products_list[i].quantity;
        }
        for (let i = 0; i < products_list.length; i++) {
          const prod = await productsRepository.getProductById(
            products_list[i].product_id
          );
          console.log(prod);
          amount += prod[0].regular_price * products_list[i].quantity;
        }
        const newCart = {
          owner_id: owner_id,
          total_quantity: total_quantity,
          products_list: products_list,
          amount: amount,
          updated_at: Math.floor(Date.now() / 1000),
        };
        await cartsRepository.updateCart(newCart, cart.id);
        return { msg: 'cart updated' };
      }
    }
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
    const cart = await cartsRepository.getCartByOwner(owner_id);
    functions.logger.info('carts from repository', cart);
    let cartToFront = {};
    cart.owner_id = owner_id;
    const newCart = await this.dtoGetCart(cart);
    cartToFront = { ...newCart };
    return cartToFront;
  }

  async dtoGetCart(cart) {
    const owner = await userRepository.getUserById(cart.owner_id);
    const products_list = [];
    for (const product of cart.products_list) {
      const productData = await productsRepository.getProductById(
        product.product_id
      );
      if (productData[0].owner_id === undefined) {
        functions.logger.error('product', product);
      }

      const seller = await userRepository.getUserById(productData[0].owner_id);
      functions.logger.info('seller', seller);

      const variationfilterd = productData[0].variations.filter(
        (variation) => variation.variation === product.variation
      );

      const details = variationfilterd[0];
      products_list.push({
        ...details,
        selle_id: seller.id,
        seller_name: seller.firstName + ' ' + seller.lastName,
        seller_email: seller.billing.email,
        storeName: seller.billing.storeName,
        name: productData.name,
        product_id: product.product_id,
        quantity: product.quantity,
        varition: product.variation,
        price: productData[0].regular_price ?? 0,
        picture: productData[0].images_url[0] || '',
      });
    }
    return {
      id: cart.id,
      owner_id: owner.id,
      owner_name: owner.firstName + ' ' + owner.lastName,
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
