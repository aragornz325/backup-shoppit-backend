/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');

class CartsServices {
  async createCartsServ(data) {
    const newCat = await db.collection('carts').add({
      ...data,
    });
    return {
      newCat,
      message: 'category created sucssefully',
    };
  }

  async getAllCartsServ() {
    const allCartsArray = [];
    const allCarts = await db.collection('carts').get();

    if (!allCarts.docs || allCarts.docs.length === 0) {
      throw boom.notFound('no carts found');
    }
    allCarts.docs.map((prod) => {
      allCartsArray.push({ id: prod.id, ...prod.data() });
    });
    return allCartsArray;
  }

  async getOneCart(id) {
    const product = await db.collection('carts').doc(id).get();
    if (!product) {
      throw boom.notFound('the carts does not exist');
    }
    return product;
  }

  async updateCartSrv(id, body) {
    const refUser = db.collection('carts').doc(id);
    const updater = await refUser.update(body);
    if (updater._writeTime) {
      return { message: `carts ${id} update`, updater };
    }
    throw boom.notImplemented('not updated');
  }

  async deleteCart(id) {
    const delCart = await db.collection('carts').doc(id).delete();
    return { message: 'carts deleted', delCart };
  }
}

module.exports = CartsServices;
