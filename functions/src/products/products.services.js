/* eslint-disable @typescript-eslint/no-var-requires */
const {db} = require("../../config/firebase");
const boom = require("@hapi/boom");
const express = require("express");

class ProductServices {
  async getAllSer() {
    console.log('entre a getAll---------> te traigo todo')
    const productArray = [];
    const products = await db.collection("products").get();
    console.log(products.docs);
    if (products === null) {
      throw boom.notFound("no products found");
    }
    console.log(products);
    products.docs.map((prod) => {
      productArray.push(prod.data());
    });
    return products;
  }

  async getProductServ(id) {
    console.log('entre aca, te traigo uno----------->')
    const product = await db.collection("products").doc(id).get();
    if (!product) {
      throw boom.notFound("the product does not exist");
    }
    return JSON.stringify(product);
  }

  async AddProductServ() {
    const newProduct = await db.collection("products").add({
      name: "un producto",
      description: "un super nuevo producto",
      price: 2500,
      currency: "u$s",
      inStock: true,
      quantityInStock: 10,
    });
    console.log(newProduct);
    return {message: "se agrego con exito"};
  }
}


//   console.log('entre aca, te traigo uno----------->')
//   const product = await db.collection("products").doc(id).get();
//   if (!product) {
//     throw boom.notFound("the product does not exist");
//   }
//   return JSON.stringify(product);
// }
// }

module.exports = ProductServices;
