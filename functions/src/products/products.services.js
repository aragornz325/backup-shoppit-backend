const boom = require('@hapi/boom');
const { serverTimestamp } = require('firebase-admin/firestore');
const { db } = require("../../config/firebase");
const axios = require('axios')
require('dotenv').config();

const apikey = process.env.apikey
const IdMLAstro = process.env.IdMLAstro 

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
    
    return {
      message: 'product created sucssefully',
      newProduct
    };
  }

  async updateProductServ(data, id) {
    const refUser = db.collection('products').doc(id);
    
    const updater = await refUser.update(data);
    if (updater._writeTime) {
      return { message: `product ${id} update`, updater };
    }
    throw boom.notImplemented('not updated');
  }

  async createAstroProduct(body){
   
    let newAstro = []
    await axios.post( `https://nova-back.astroselling.com/jupiter/v1/channels/${IdMLAstro}/products?api_token=${apikey}`, {...body})
    .then(function (response) {
    newAstro.push(response.data)
    })
    .catch(function (error) {
     throw new Error(error)
       
    });  
    return newAstro[0]

  }
async getAllAstroProduct () {

  const allAstro = await axios.get(`https://nova-back.astroselling.com/jupiter/v1/channels/${IdMLAstro}/products?api_token=${apikey}&limit=20&offset=0`)
  return allAstro.data
}
}
module.exports = ProductServices;


