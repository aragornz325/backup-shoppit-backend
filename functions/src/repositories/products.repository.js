const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class ProductsRepository {
  async createProduct(payload) {
    let productID = '';
    await db
      .collection('productspruebasheet')
      .add(payload)
      .then((docRef) => {
        productID = docRef.id;
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return productID;
  }

  async createdInBatch(payload) {
    const batch = db.batch();
    payload.forEach((product) => {
      const productRef = db.collection('products');
      batch.set(productRef, product);
    });
    functions.logger.log('Batch created');
    await batch.commit();
    functions.logger.log('Batch committed');
    return { msg: 'batch ok' };
  }

  async getProductById(id) {
    let product = {};
    await db
      .collection('productodPrueba')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          product = doc.data();
        } else {
          throw boom.badData(`The product with id ${id} does not exist`);
        }
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return product;
  }

  async updateProduct(id, payload) {
    await db
      .collection('productodPrueba')
      .doc(id)
      .set(payload, { merge: true })
      .catch((error) => {
        throw boom.badData(error);
      });
    return { msg: 'updated' };
  }
}

module.exports = ProductsRepository;
