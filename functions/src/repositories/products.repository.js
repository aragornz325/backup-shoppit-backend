const { db } = require('../../config/firebase');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');
const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const CategoryRepository = require('../repositories/categories.repositories');
const categoryRepository = new CategoryRepository();
const algoliaserch = require('algoliasearch');
const client = algoliaserch(
  `${config.algolia.algoliaProductsAppId}`,
  `${config.algolia.algoliaProductsApiSerch}`
);
const index = client.initIndex(`${config.algolia.algoliaProductsIndexName}`);
const { chunckarray } = require('../utils/auxiliar');

class ProductsRepository {
  async createProduct(payload, id) {
    //await userRepository.getUserById(id);
    // let total_stock = 0;
    // if (payload.variations.length === 1) {
    //   total_stock = parseInt(payload.variations[0].quantity, 10);
    // } else {
    //   for (let i = 0; i < payload.variations.length; i++) {
    //     total_stock += parseInt(payload.variations[i].quantity, 10);
    //   }
    // }

    let productID = '';
    await db
      .collection('products')
      .add({ ...payload })
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
    let productsToFront = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const category = await categoryRepository.getCategoryById(
        product.category
      );

      if (category === undefined) {
        functions.logger.log('category not found');
        throw boom.badData(`Category in product ${product.name} not found`);
      }

      delete product.is_valid;
      delete product.published;
      productsToFront.push({
        ...product,
        category: category.name,
      });
    }

    return productsToFront;
  }

  async getProductByName(name) {
    let products = {};
    await db
      .collection('products')
      .where('name', '==', name)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          products = {
            ...doc.data(),
          };
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return products;
  }

  async updateProduct(id, payload) {
    await this.getProductById(id);
    await db
      .collection('products')
      .doc(id)
      .set(payload, { merge: true })
      .catch((error) => {
        throw boom.badData(error);
      });
    return { msg: 'updated' };
  }

  async deleteProductWooCoomerce(id) {
    let idToDelete = '';
    await db
      .collection('products')
      .where('id', '==', parseInt(id, 10))
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc);
          idToDelete = doc.id;
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    await db
      .collection('products')
      .doc(idToDelete)
      .delete()
      .catch((error) => {
        throw boom.badData(error);
      });
    return { msg: 'deleted' };
  }

  async deleteProduct(id) {
    await this.getProductById(id);
    await db
      .collection('products')
      .doc(id)
      .delete()
      .catch((error) => {
        throw boom.badData(error);
      });
    return { msg: 'ok' };
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
    let prodToFront = [];
    for (let i = 0; i < products.length; i++) {
      const category = await categoryRepository.getCategoryById(
        products[i].category
      );
      delete products[i].is_valid;
      delete products[i].published;
      prodToFront.push({
        ...products[i],
        category: category.name,
      });

      return prodToFront;
    }
  }

  async getProductById(id) {
    let product = [];
    await db
      .collection('products')
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw boom.notFound('Product not found');
        } else {
          product.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    if (product[0].is_valid === false || product[0].published === false) {
      throw boom.badRequest('no valid product');
    }
    const category = await categoryRepository.getCategoryById(
      product[0].category
    );

    delete product[0].is_valid;
    delete product[0].published;
    product[0].category = category.name;

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
    let productswithIdCategory = [];
    await db
      .collection('products')
      .where('category[0].id', '==', category)
      .orderBy('name')
      .limit(parseInt(limit, 10))
      .startAfter(parseInt(offset, 10))
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          productswithIdCategory.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    let products = [];
    for (let i = 0; i < productswithIdCategory.length; i++) {
      let categoryName = '';
      const catergory = await categoryRepository.getCategoryById(
        productswithIdCategory[i].category
      );
      categoryName = catergory.name;
      delete productswithIdCategory[i].is_valid;
      delete productswithIdCategory[i].published;
      products.push({
        ...productswithIdCategory[i],
        category: categoryName,
      });
    }
    return products;
  }

  async getProductsByCategoryAndSearch(search, category, limit, offset) {
    const productAlgolia = await this.getIndexAlgolia(search, limit, offset);

    const productIdschuncked = await chunckarray(productAlgolia, 10);

    const products = [];

    for (let i = 0; i < productIdschuncked.length; i++) {
      await db
        .collection('products')
        .where('id', 'in', productIdschuncked[i])
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
    let prodToFront = [];
    for (let i = 0; i < products.length; i++) {
      const category = await categoryRepository.getCategoryById(
        products[i].category
      );
      delete products[i].is_valid;
      delete products[i].published;
      prodToFront.push({
        ...products[i],
        category: category.name,
      });
    }

    return prodToFront;
  }

  async getProductsByOwner(owner_id) {
    let products = [];
    await db
      .collection('products')
      .where('owner_id', '==', owner_id)
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

  async deleteProductByOwner(owner_id) {
    const products = await this.getProductsByOwner(owner_id);
    if (products.length === 0) {
      functions.logger.log('No product found for this owner');
      return { msg: 'ok' };
    }
    const productIds = products.map((product) => product.id);
    const batch = db.batch();
    productIds.forEach((id) => {
      const ref = db.collection('products').doc(id);
      batch.delete(ref);
    });
    await batch.commit();
    functions.logger.log('Products deleted');
    return {
      msg: 'ok',
    };
  }
}

module.exports = ProductsRepository;
