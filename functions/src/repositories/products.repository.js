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

  async getProducts(limit, offset) {
    console.log('voy a buscar todos');
    const products = [];
    await db
      .collection('products')
      .orderBy('name')
      .limit(limit)
      .startAfter(offset)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return products;
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

  async getProductByFilter(search, offset, limit) {
    console.log('voy a buscar por filtro', search);
    let productN = [];
    const parameter = Object.keys(search).toString();
    const objetive = search[parameter];
    const collectionRef = db
      .collection('products')
      .where(parameter, '==', objetive)
      .limit(limit);

    await collectionRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        productN.push(doc.data());
      });
    });
    return {
      ...productN,
      total: productN.length,
    };
  }

  async getProductByOwner(ownerId, limit, offset) {
    console.log('voy a buscar por owner', ownerId);
    const products = [];
    await db
      .collection('products')
      .where('owner_id', '==', ownerId)
      .limit(limit)
      .startAfter(offset)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return products;
  }
}

module.exports = ProductsRepository;
