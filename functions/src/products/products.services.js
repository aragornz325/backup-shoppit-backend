/* eslint-disable @typescript-eslint/no-var-requires */
const {db} = require("../../config/firebase");
const boom = require("@hapi/boom");
const express = require("express");
const {serverTimestamp } = require("firebase-admin/firestore");

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
    return {message: ' product created sucssefully',
      newProduct}
  }

  async updateProductServ (data, id){
    
     console.log('llegue al servide', data, id)
     let refUser = db.collection("products").doc(id)
     //console.log(refUser)
     console.log(`product => ${id} se actualiza con ${data}`)
     if (!refUser){
       throw boom.notFound(`${id}`)
        }
       let updater = await refUser.update(data)
       console.log(updater)
       if(updater._writeTime){
       return { message: `product ${id} update`, updater}
       }else{
       throw boom.notImplemented('not updated')
        }
     
     
     
     //const snapshot = db.collection("products").doc(id).get()
    //  if(!snapshot){
    //    throw boom.notFound
    //  }
    //  console.log(snapshot)
    //  const res = await snapshot.update({price: 10})
     //console.log('esto es res--------------------------->', snapshot)
      //return { message: `product ${id} was updated`, 
        //      snapshot,  }
    
   
  }

}




module.exports = ProductServices;
