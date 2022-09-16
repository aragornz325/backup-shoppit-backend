//const { db } = require('../../config/firebase');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { user } = require('firebase-functions/v1/auth');
const functions = require('firebase-functions');
require('dotenv').config();

//credenciales

initializeApp({
  credential: cert({
    clientEmail:
      'firebase-adminsdk-vlwwk@shoppit-app-stg.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD21OiNgGIBF28f\na+hz/un8YUtqJ7NGAkYTf998DPldIdv08RziZ6Y1FZ4jk2GKhsPxc9YB1l8E4UoV\nOfJR2GdYlgvdDgoFRJRAYz9vpO3OAm9W7++Jpg0aCNeQE20ffrHl/y/ZG07QXXXN\neYOSeqoR5OPrJfQIGTrraBBly5gX7sATg3Y9Vqq8n8r7UY9/uy2lR8qHWaopnYkb\n1xFt8vyg1XkyM7JR/9NeIyjrNpz3BnXo6FYF835IRQ8H6Y7UAHzL/tdTFlT8BfcN\nykzlG235KSbAbulEPmiQBoc9A/NNurJ3rklWMPXcmZwPsgC8/mQX53Xe3SaZ1jcN\nvPk7DxKRAgMBAAECggEAE0EBZkRM9h6Arbf0+Si50io5aphFMjasMQozrHwLRESy\nC+B2VdeATg9tIgOgQ2DcI6ywVWgGSnL+ceXEGAv5knNF4qJH4tL6KNmfvFLmX+sD\nCgo2VQuYZbRUiFRo7zYqpLEWvOiV6cgDOpokysYkbQ096tJaP6V5hJ0TUQrOxuhS\nvhPffnIFA1DdXx6/Qs1/r6L4Iz+6tFSGGhsh1BI3JVCAxrYlwqG7p5ZDypgECt8w\nbR+kyWlyB3AHPI1M3Y/77wYJtGTWqQDQDOoGPiBpBayvRgGv93e04HzSAXcjvNO1\nH+7H/i5zhxhZcfRZ7JaqM6eydTKsIHao+1vwbe1GqQKBgQD7g/Kd6/q0jK3UqnMp\niQxN7WKsiQwlvaj8vEsdPkwzFcz9dxvFGvsGxNocf9ZU/uqi0A1/vxu9rebFbyUw\nGNq3XDYEqelXs7/wG08ZbU4Ypo4sbYT7Wl/rC/5zek5ULUpcKbTc7kwzLfgqKTrp\nOVXp475KTq/qlMZBSDJHswy8TQKBgQD7O5TfYR2xiDpfNeE97uZeIUYAbcv0aB8O\n9UwkkRClj8IHgkswll1tx4S4jFYPBWAwdSafxh4YpL98XtObFq2t6r2caiKt4qth\nKD47tvdQqUtZqyR0HHI3O1onMVRryqB/Hkw4dAX1in1lZjZmIRYQV6uShqWz2Kex\n5nIxCplBVQKBgEc0selXt6CJ+2Sr5PKrZBpjzH3ARvogWclDnZhn3LbRwzk3EVua\nKdteu8k5v/pMOS1i7Y9vEXF/3EelEcguIS2sI3bqi69SqlJVyO0P7v43mSSm1PE8\nQs+Ok7kptSdLszOocxXhOR18NDfreEwy+UnAOk1bPZ6SBBbTU7jMzhw5AoGBANdA\nglotpDpSpOikilr9EEXALnD5odDDUTEIvHdsDx47IJw8Z122x0/irXVNUALIsVRz\nW2dzYJ/ur93IhXcQpDgpstGMIjBn0DyLNV8Gcbmbg2LNfos5QCbQZHrGCjXcw0yG\n0flgdyacxLmXLK6uVHAmHWuKj/iafXuwHVClaw+NAoGBAKe4Z+fFVFwgPjmOo6TW\n59T4qV7dMOS2Tqg/7SDNnJCn4LGThFToeycKAnihzikrlbocRSW/B8QQglIhr9vK\nC9UO+jlctJ+NYy+wcb/wYHA3bwNxPJxIfMPb9baQS4bnJ/CMBcoFqDuv88YEOoWm\n209BPrLuRLGYWgLMs9IqVmY5\n-----END PRIVATE KEY-----\n',
    projectId: 'shoppit-app-stg',
  }),
  databaseURL: 'https://shoppit-app-stg-default-rtdb.firebaseio.com',
});

const db = getFirestore();

const checkProducts = async () => {
  const products = await db.collection('products').get();
  let productsIdsArray = [];
  products.forEach((product) => {
    productsIdsArray.push(product.id);
  });

  functions.logger.info(productsIdsArray);
  for (let i = 0; i < productsIdsArray.length; i++) {
    const product = await db
      .collection('products')
      .doc(productsIdsArray[i])
      .get();
    functions.logger.info(`getting user from product ${product.id}`);
    const user = await db
      .collection('users')
      .doc(product.data().owner_id)
      .get();

    if (user === undefined) {
      functions.logger.info(`product ${product.data().name} has no owner`);
    } else {
      functions.logger.info(
        `the owner of product ${product.data().name} is ${user.data().email}`
      );
      const category = await db
        .collection('categories')
        .doc(product.data().category)
        .get();
      if (category === undefined) {
        functions.logger.info(`product ${product.data().name} has no category`);
      } else {
        functions.logger.info(
          `the category of product ${product.data().name} is ${
            category.data().name
          }`
        );
      }
    }
    let flag = true;
    if (!product.id) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no id`);
    }
    if (!product.data().min_sell_amount) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no min_sell_amount`
      );
    }
    if (!product.data().images_url) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no images_url`
      );
    }
    if (!product.data().total_stock) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no total_stock`
      );
    }
    if (!product.data().dimensions) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no dimensions`
      );
    }
    if (!product.data().thumbnail) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no thumbnail`);
    }
    if (!product.data().features) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no features`);
    }
    if (!product.data().name) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no name`);
    }
    if (!product.data().variations) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no variations`
      );
    }
    if (!product.data().owner_id) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no owner_id`);
    }
    if (!product.data().regular_price) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no regular_price`
      );
    }
    if (!product.data().description) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no description`
      );
    }
    if (!product.data().offer_price) {
      flag = false;
      functions.logger.error(
        `product ${product.data().name} has no offer_price`
      );
    }
    if (!product.data().category) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no category`);
    }
    if (!product.data().state) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no state`);
    }

    if (!product.data().currency) {
      flag = false;
      functions.logger.error(`product ${product.data().name} has no currency`);
    }

    flag = false;
    if (flag === false) {
      functions.logger.warn(
        `product ${product.data().name} has errors nand be deactived`
      );
      // await db.collection('products').doc(product.id).update({
      //   is_valid: true,
      // });
    } else {
      functions.logger.info(`product ${product.data().name} is valid`);
    }
  }

  return { msg: 'checked' };
};
checkProducts();
