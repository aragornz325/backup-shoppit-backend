const boom = require('@hapi/boom');
const { serverTimestamp } = require('firebase-admin/firestore');
const { db } = require("../../config/firebase");

class ProductServices {
  async getAllSer() {
    const productsArray = [];
    const products = await db.collection('products').get();

    if (!products.docs || products.docs.length == 0) {
      throw boom.notFound('no products found');
    }
    products.docs.map((prod) => {
      productsArray.push({id: prod.id, ...prod.data()});
    });
    return productsArray;
  }

  async getProductServ(id) {
    const product = await db.collection('products').doc(id).get();
    if (!product) {
      throw boom.notFound('the product does not exist');
    }
    return product;
  }

  async AddProductServ(body) {
    const newProduct = await db.collection('products').add({
      body,
    });
    console.log(newProduct)
    return {
      message: 'product created sucssefully',
      newProduct
    };
  }

  async updateProductServ(data, id) {
    const refUser = db.collection('products').doc(id);
    console.log(`product => ${id} se actualiza con ${data}`);
    const updater = await refUser.update(data);
    if (updater._writeTime) {
      return { message: `product ${id} update`, updater };
    }
    throw boom.notImplemented('not updated');
  }
}
module.exports = ProductServices;
