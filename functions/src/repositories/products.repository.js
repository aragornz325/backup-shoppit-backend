const { db } = require('../../config/firebase');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class ProductsRepository {
  async createProduct(payload, id) {
    const checkUser = await db.collection('users').doc(id).get();
    if (!checkUser.exists) {
      functions.logger.error(`User with id ${id} does not exists`);
      throw boom.badRequest('User not found');
    }
    let checkProduct;
    await db
      .collection('productspruebacrud')
      .where('name', '==', payload.name)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          checkProduct = doc.data();
        });
      });
    if (checkProduct && checkProduct.sku === payload.sku) {
      functions.logger.error(`Product with sku ${payload.sku} already exists`);
      throw boom.badRequest('Product already exists');
    }

    let total_stock = 0;
    payload.variations.forEach((variation) => {
      total_stock += variation.quantity;
    });

    await db.collection('productspruebacrud').add({
      name: payload.name,
      description: payload.description,
      regular_price: payload.regular_price,
      state: payload.state,
      variations: payload.variations.map((element, index) => {
        return {
          ...element,
          sku: element.sku || `${id}_variation_${index}`,
        };
      }),
      images_url: payload.images_url,
      category: payload.category,
      publish: payload.publish,
      offer_price: payload.offer_price,
      min_sell_amount: payload.min_sell_amount,
      total_stock,
      owner_id: id,
    });
    return { msg: 'created' };
  }

  async getProductById(id) {
    const product = await db.collection('products').doc(id).get();
    if (!product.exists) {
      throw boom.notFound(`Product with id ${id} does not exists`);
    }

    return product.data();
  }

  async getProducts() {
    const products = await db.collection('products').get();
    const productsList = products.docs.map((doc) => doc.data());
    return {
      productsList,
      total: productsList.length,
    };
  }

  async updateProduct(id, payload, merge) {
    const product = await db.collection('products').doc(id).get();
    if (!product.exists) {
      throw boom.notFound(`Product with id ${id} does not exists`);
    }
    await db.collection('products').doc(id).set(payload, { merge: merge });
    return;
  }

  async deleteProduct(id) {
    const product = await db.collection('products').doc(id).get();
    if (!product.exists) {
      throw boom.notFound(`Product with id ${id} does not exists`);
    }
    await db.collection('products').doc(id).delete();
    return;
  }
}

module.exports = ProductsRepository;
