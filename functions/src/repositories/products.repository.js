const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class ProductsRepository {
  async createProduct(payload) {
    let productID = '';
    await db
      .collection('productodPrueba')
      .add(payload)
      .then((docRef) => {
        productID = docRef.id;
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return productID;
  }
}

module.exports = ProductsRepository;
