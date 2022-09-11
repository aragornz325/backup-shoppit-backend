const { db } = require('../../config/firebase');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const algoliaserch = require('algoliasearch');
const client = algoliaserch(
  `${config.algolia.algoliaProductsAppId}`,
  `${config.algolia.algoliaProductsApiSerch}`
);
const index = client.initIndex(`${config.algolia.algoliaProductsIndexName}`);
const { chunckarray } = require('../utils/auxiliar');

class ProductsRepository {
  async createProduct(payload, id) {
    await userRepository.getUserById(id);
    let total_stock = 0;
    if (payload.variations.length === 1) {
      total_stock = parseInt(payload.variations[0].quantity, 10);
    } else {
      for (let i = 0; i < payload.variations.length; i++) {
        total_stock += parseInt(payload.variations[i].quantity, 10);
      }
    }

    let productID = '';
    await db
      .collection('products')
      .add({ total_stock, ...payload })
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
    const products = [];
    await db
      .collection('products')
      .where('published', '==', true)
      .where('is_valid', '==', true)
      .orderBy('name')
      .limit(parseInt(limit, 10))
      .startAfter(parseInt(offset, 10))
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
      .collection('products')
      .doc(id)
      .set(payload, { merge: true })
      .catch((error) => {
        throw boom.badData(error);
      });
    return { msg: 'updated' };
  }

  async getProductByFilter(search, offset, limit) {
    let productN = [];
    const parameter = Object.keys(search).toString();
    let objetive = '';
    if (Number.isInteger(parseInt(Object.values(search), 10))) {
      objetive = parseInt(Object.values(search), 10);
    } else {
      objetive = Object.values(search);
    }
    const collectionRef = db
      .collection('products')
      .where(parameter, '==', objetive[0])
      .where('published', '==', true)
      .where('is_valid', '==', true);
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
    const products = [];
    await db
      .collection('products')
      .where('owner_id', '==', ownerId)
      .where('published', '==', true)
      .where('is_valid', '==', true)
      .orderBy('name')
      .limit(parseInt(limit, 10))
      .startAfter(parseInt(offset, 10))
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
    await db
      .collection('products')
      .where('vendor.vendor_id', '==', ownerId)
      .where('published', '==', true)
      .where('is_valid', '==', true)
      .orderBy('name')
      .limit(parseInt(limit, 10))
      .startAfter(parseInt(offset, 10))
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

  async getIndexAlgolia(search, limit, offset) {
    let result = [];
    const resultAlgolia = await index.search(`${search}`, {
      hitsPerPage: parseInt(limit, 10),
      length: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    resultAlgolia.hits.forEach((product) => {
      result.push(product.objectID);
    });

    return result;
  }

  async getProductWithAlgolia(search, limit, offset) {
    let products = [];
    const productIds = await this.getIndexAlgolia(search, limit, offset);

    for (let i = 0; i < productIds.length; i++) {
      await db
        .collection('products')
        .doc(productIds[i])
        .get()
        .then((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          });
        })
        .catch((error) => {
          throw boom.badData(error);
        });
    }
    products.filter(
      (product) => product.published === true && product.is_valid === true
    );
    return products;
  }

  async getProductById(id) {
    let product = [];
    await db
      .collection('products')
      .doc(id)
      .get()
      .then((doc) => {
        product.push({
          id: doc.id,
          ...doc.data(),
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return product;
  }

  async getProductsByIds(ids) {
    // get product in batch
    const products = [];
    const docRef = ids.map((id) => db.collection('products').doc(id));
    await db
      .getAll(...docRef)
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

  async getProductsByCategory(category, limit, offset) {
    const products = [];
    await db
      .collection('products')
      .where('category', '==', category)
      .where('published', '==', true)
      .where('is_valid', '==', true)
      .orderBy('name')
      .limit(parseInt(limit, 10))
      .startAfter(parseInt(offset, 10))
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

  async getProductsByCategoryAndSearch(search, category, limit, offset) {
    const productAlgolia = await this.getProductWithAlgolia(
      search,
      limit,
      offset
    );

    //filter ids from productAlgolia
    const productIds = productAlgolia.map((product) => product.name);
    const productIdschuncked = await chunckarray(productIds, 10);
    const products = [];

    for (let i = 0; i < productIdschuncked.length; i++) {
      await db
        .collection('products')
        .where('name', 'in', productIdschuncked[i])
        .where('category', '==', category)
        .where('published', '==', true)
        .where('is_valid', '==', true)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            products.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
    }
    return products;
  }
}

module.exports = ProductsRepository;
