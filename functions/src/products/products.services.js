/* eslint-disable @typescript-eslint/no-var-requires */
const {db} = require("../../config/firebase");
const boom = require("@hapi/boom");
const express = require("express");

class ProductServices {
  async getAllSer() {
    const productsArray = [];
    const products = await db.collection("products").get();

    if (!products.docs || products.docs.length == 0) {
      throw boom.notFound("no products found");
    }
    products.docs.map((prod) => {
      productsArray.push(prod.data());
    });
    return productsArray;
  }

  async getProductServ(id) {
    console.log('entre aca, te traigo uno----------->')
    const product = await db.collection("products").doc(id).get();
    if (!product) {
      throw boom.notFound("the product does not exist");
    }
    return JSON.stringify(product);
  }

  async AddProductServ(body) {
    
    const newProduct = await db.collection("products").add({
    ...body   
    });
    console.log(newProduct)
    if (!newProduct){
      throw boom.badData('no se creo nada')
    } else {
      return {
        message: "product created successfully",
        FDM: newProduct
      }
    }
  }
}




module.exports = ProductServices;
