/* eslint-disable @typescript-eslint/no-var-requires */
const {db} = require("../../config/firebase");
const boom = require("@hapi/boom");


class ProductServices {
  async getAllSer() {
    const productArray = [];
    const products = await db.collection("products").get();
    if (!products) {
      throw boom.notFound("no products found");
    }
    products.docs.map((prod) => {
      productArray.push(prod.data());
    });
    return productArray;
  }

  async getProductServ(id) {
    const product = await db.collection("products").doc(id).get();
    if (!product.exists) {
      throw boom.notFound("the product does not exist");
    }
    return product;
  }
}

module.exports = ProductServices;
