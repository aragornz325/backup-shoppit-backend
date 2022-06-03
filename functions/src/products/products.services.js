const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');
const axios = require('axios');
require('dotenv').config();
const functions = require('firebase-functions');

const APIKEY = process.env.APIKEY;
const IDMLASTRO = process.env.IDMLASTRO;

class ProductServices {
  async getAllSer(limitt, offset) {
    let allProd = [];
    const prodRef = db
      .collection('products')
      .where('isAstroselling', '==', false)
      .offset(offset);

    const products = await prodRef.limit(limitt).orderBy('name').get();

    products.docs.map((doc) => {
      allProd.push({ id: doc.id, ...doc.data() });
    });
    const astros = await this.getAllAstroProduct();
    astros.map((doc) => {
      allProd.push(doc);
    });
    allProd = allProd.sort(function () {
      return Math.random() - 0.5;
    });
    if (allProd.length <= 0) {
      throw boom.notFound('no products found');
    }

    return {
      data: allProd,
      metadata: {
        limit: limitt,
        offset: offset,
        ShoppitProduct: products.docs.length,
        AstrosellingProduct: astros.length,
      },
    };
  }

  async getProductServ(id) {
    const prodRef = db.collection('products').doc(id);

    const doc = await prodRef.get();
    if (!doc.exists) {
      throw boom.notFound('product not found');
    }
    if (doc.data().isAstroselling) {
      const product = await this.getOneAstroProduct(id);
      return {
        ...doc.data(),
        ...product,
      };
    } else {
      return doc.data();
    }
  }

  async updateProductServ(data, id) {
    const refUser = db.collection('products').doc(id);
    const doc = await refUser.get();
    if (doc.data().isAstroselling) {
      const updAstro = await this.updateAstroProduct(
        data,
        id,
        doc.data().channel_id
      );
      return updAstro;
    } else {
      const updater = await refUser.update(data);
      if (!updater._writeTime) {
        throw boom.notImplemented('not updated');
      }
      return { message: `product ${id} update`, updater };
    }
  }

  async AddProductServ(body) {
    if (body.isAstroselling && body.channel_id) {
      const newProduct = await db.collection('products').add({
        isAstroselling: body.isAstroselling,
        channel_id: body.channel_id,
      });
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

      await this.createAstroProduct(dataAstro, body.channel_id);
      return {
        message: 'product created sucssefully',
        id: newProduct._path.segments[1],
      };
    } else {
      const newProduct = await db.collection('products').add({
        ...body,
      });
      return {
        message: 'product created sucssefully',
        id: newProduct._path.segments[1],
      };
    }
  }

  async createAstroProduct(body, channel_id) {
    let newAstro = [];
    await axios
      .post(
        `https://nova-back.astroselling.com/jupiter/v1/channels/${channel_id}/products?api_token=${APIKEY}`,
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
      `https://nova-back.astroselling.com/jupiter/v1/channels/${IDMLASTRO}/products/${id}?api_token=${APIKEY}`
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

  async getAllAstroProduct(limit, offset) {
    const allAstro = await axios.get(
      `https://nova-back.astroselling.com/jupiter/v1/channels/${IDMLASTRO}/products?api_token=${APIKEY}&limit=20&offset=0`
    );

    if (allAstro.data.data.length <= 0) {
      throw boom.notFound('no products found');
    }
    if (limit && offset) {
      return allAstro.data.data.slice(
        parseInt(offset, 10),
        parseInt(limit, 10)
      );
    } else {
      return allAstro.data.data;
    }
  }

  async updateAstroProduct(data, id) {
    const prodRef = db.collection('products').doc(id);
    const prodDoc = await prodRef.get();
    const resposse = [];
    functions.logger.info(data);
    await axios
      .put(
        `https://nova-back.astroselling.com/jupiter/v1/channels/${IDMLASTRO}/products/${id}?api_token=${APIKEY}`,
        { data }
      )
      .then(function (response) {
        resposse.push(response.data);
      })
      .catch(function (error) {
        throw new Error(error);
      });
    return resposse[0];
  }

  async deleteProductServ(id) {
    const refUser = db.collection('products').doc(id);
    const doc = await refUser.get();
    if (doc.data().isAstroselling) {
      try {
        await this.deleteAstroProduct(id, doc.data().channel_id);
        await refUser.delete();
      } catch (error) {
        throw new Error(error);
      }
    }
    const deleter = await refUser.delete();
    if (deleter._writeTime) {
      return { message: `product ${id} deleted`, deleter };
    }
    throw boom.notImplemented('not deleted');
  }

  async deleteAstroProduct(id, channel_id) {
    const resposse = [];
    await axios
      .delete(
        `https://nova-back.astroselling.com/jupiter/v1/channels/${channel_id}/products/${id}?api_token=${APIKEY}`
      )
      .then(function (response) {
        resposse.push(response.data);
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }
}
module.exports = ProductServices;
