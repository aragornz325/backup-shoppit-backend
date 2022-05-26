const boom = require('@hapi/boom');
const { serverTimestamp } = require('firebase-admin/firestore');
const { db } = require('../../config/firebase');
const axios = require('axios');
require('dotenv').config();

const apikey = process.env.apikey;
const IdMLAstro = process.env.IdMLAstro;

class ProductServices {
  async getAllSer() {
    const productsArray = [];
    const products = await db.collection('products').get();

    if (!products.docs || products.docs.length == 0) {
      throw boom.notFound('no products found');
    }
    products.docs.map((prod) => {
      productsArray.push({ id: prod.id, ...prod.data() });
    });
    return productsArray;
  }

  async getProductServ(id) {
    const prodRef = db.collection('products').doc(id);

    const doc = await prodRef.get();
    if (!doc.exists) {
      throw boom.notFound('product not found');
    } else {
      return doc.data().body;
    }
  }

  async updateProductServ(data, id) {
    const refUser = db.collection('products').doc(id);

    const updater = await refUser.update(data);
    if (updater._writeTime) {
      return { message: `product ${id} update`, updater };
    }
    throw boom.notImplemented('not updated');
  }

  async AddProductServ(body) {
    const newProduct = await db.collection('products').add({
      body,
    });
    if (body.isAstroselling) {
      const dataAstro = {
        id_in_erp: newProduct._path.segments[1],
        sku: newProduct._path.segments[1],
        title: body.name,
        description: body.description,
        currency: 'ARS',
        price: 152,
        stock: 10,
        variations: body.variable_products.map((variation) => {
          return {
            id_in_erp:
              newProduct._path.segments[1] +
              `-00${body.variable_products.indexOf(variation) + 1}`,
            sku: `${newProduct._path.segments[1]}/${variation.color}/${variation.size}`,

            title: `${body.name} -- variacion 00${
              body.variable_products.indexOf(variation) + 1
            } --`,
            images: body.images.map((img) => {
              return {
                path: img,
              };
            }),
            color: variation.color,
            ...variation,
          };
        }),

        images: body.images.map((img) => {
          return {
            path: img,
          };
        }),
      };

      const toAstro = await this.createAstroProduct(dataAstro);
      console.log(toAstro);
    }
    return {
      message: 'product created sucssefully',
      id: newProduct._path.segments[1],
    };
  }

  async createAstroProduct(body) {
    let newAstro = [];
    await axios
      .post(
        `https://nova-back.astroselling.com/jupiter/v1/channels/${IdMLAstro}/products?api_token=${apikey}`,
        { ...body }
      )
      .then(function (response) {
        newAstro.push(response.data);
      })
      .catch(function (error) {
        throw new Error(error);
      });
    return newAstro[0];
  }

  async getOneAstroProduct(id) {
    const oneAstro = await axios.get(
      `https://nova-back.astroselling.com/jupiter/v1/channels/${IdMLAstro}/products/${id}?api_token=${apikey}`
    );
    const response = {
      ...oneAstro.data,
      variations: oneAstro.data.variations.map((variation) => {
        const data = variation.sku.split('/');
        return {
          ...variation,
          color: data[1],
          size: data[2],
        };
      }),
    };
    return response;
  }

  async getAllAstroProduct() {
    const allAstro = await axios.get(
      `https://nova-back.astroselling.com/jupiter/v1/channels/${IdMLAstro}/products?api_token=${apikey}&limit=20&offset=0`
    );

    if (allAstro.data.data.length <= 0) {
      throw boom.notFound('no products found');
    } else {
      return allAstro.data;
    }
  }
}
module.exports = ProductServices;
