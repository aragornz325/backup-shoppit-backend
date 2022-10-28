const XLSX = require('xlsx');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const functions = require('firebase-functions');
const { chunckarray } = require('../utils/auxiliar');

const { config } = require('../config/config');
require('dotenv').config();

const WooDb = new WooCommerceRestApi({
  url: 'https://shoppit.com.ar/',
  consumerKey: 'ck_6297661bf04733d57612f24f2a00a78f35e1f1c2',
  consumerSecret: 'cs_7d032d7dadbdac14611e59be3f203de6fcf9c550',
  version: 'wc/v3',
});

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

async function readXlsx(path) {
  const workbook = XLSX.readFile(path);
  const workbookSheets = workbook.SheetNames;

  const sheet = workbookSheets[1];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

  for (let i = 0; i < dataExcel.length; i++) {
    const product = dataExcel[i];
    if (!product.SKU || !product.SAP) {
      functions.logger.error(`SKU is missing for product ${product}`);
      continue;
    }

    const categoria = await getcategoryByProduct(product['Rubro']);

    const payload = {
      name: product['Descripcion'] || 'missing data',
      type: 'grouped',
      regular_price: product['LISTA MELI c/impuestos'] || '0.00',
      description: product['Rubro'] || 'missing data',
      short_description: product['Rubro'] || 'missing data',
      categories: [
        {
          id: categoria,
        },
      ],
      images: [
        {
          src:
            product['Imagen'] ||
            'https://bullseyetrading.com.au/assets/components/phpthumbof/cache/warehouse2.3df28ae2b7cfd96bd9edfc0d39091ee926.jpg',
        },
      ],
      sku: `${product['SKU']}-${product['SAP']}` || 'missing data',
      price:
        product['LISTA GENERAL c/impuestos'] !== undefined
          ? parseFloat(
              product['LISTA GENERAL c/impuestos']
                .split(' ')[1]
                .replace(',', '.'),
              10
            )
          : 0,
      shipping_required: true,
      status: 'publish',
      manage_stock: true,
    };

    const prodWooCommerce = await WooDb.post('products', payload);

    await db.collection('products').add({
      ...prodWooCommerce.data,
      spa: product['SAP'],
      sku: product['SKU'],
    });
  }
  functions.logger.info('all done');
  return { msg: 'ok' };
}

async function updateStock(path) {
  const workbook = XLSX.readFile(path);
  const workbookSheets = workbook.SheetNames;

  const sheet = workbookSheets[0];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

  let update = [];

  for (let i = 0; i < dataExcel.length; i++) {
    const product = dataExcel[i];
    if (!product.SKU || !product.SAP) {
      functions.logger.error(
        `SKU is missing for product ${product['Cod.Art']}, please check this product`
      );
      continue;
    }

    const stock_quantity = parseInt(product['Stock Bultos'], 10) || 0;
    const stock_status = stock_quantity <= 0 ? 'outofstock' : 'instock';
    const payload = {
      stock_quantity,
      stock_status,
    };

    const querySnapshot = await db
      .collection('products')
      .where('sku', '==', product['SKU'])
      .where('spa', '==', product['SAP'])
      .get();
    querySnapshot.forEach(async (doc) => {
      update.push({ id: doc.data().id, ...payload });
      await db.collection('products').doc(doc.id).update(payload);
    });
  }

  const chunked = await chunckarray(update, 90);
  chunked.forEach(async (chunk) => {
    await WooDb.post('products/batch', { update: chunk });
  });

  functions.logger.info('all done');
  return { msg: 'ok' };
}

async function deleteAllProducts() {
  let prodfromWoo = [];
  let onlyIds = [];
  await WooDb.get('products', {
    per_page: 30,
  })
    .then((response) => {
      prodfromWoo.push(response.data);
    })
    .catch((error) => {
      functions.logger.info(error.response.data);
    });
  prodfromWoo[0].forEach((prod) => {
    onlyIds.push(prod.id);
  });
  onlyIds.forEach(async (id) => {
    await WooDb.delete(`products/${id}`)
      .then((response) => {
        functions.logger.info(`Product ${id} deleted`);
      })
      .catch((error) => {
        functions.logger.info(error.response.data);
      });
  });
}

async function getAllCategories() {
  let categories = [];
  await WooDb.get('products/categories', {
    per_page: 100,
  })
    .then((response) => {
      functions.logger.info('response length', response.data.length);
      categories.push(response.data);
    })
    .catch((error) => {
      functions.logger.info(error.response.data);
    });
  categories[0].forEach(async (cat) => {
    await db.collection('categories').add({
      ...cat,
    });
    functions.logger.info(`Category ${cat.name} added`);
  });
}

async function getcategoryByProduct(rubro) {
  if (rubro === 'Aderezos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Aderezos')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Almacen') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Almacen')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Anexo') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Hogar')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Azucar') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Almacen')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Barras') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Kiosko')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Bebidas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Bebidas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Bolsas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Accesorios')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Cabello') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Cuidado Personal')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Cafe') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Infusiones')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Caldos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'almacen')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Capsulas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Infusiones')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Caramelos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Golosinas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Chicles') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Golosinas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Chocolates') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Golosinas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Cigarrillos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Cigarrillos')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Compactos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Lavado')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Condimentos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Condimentos')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Cuidado del aire') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Limpieza')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Cuidado del hogar') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Limpieza')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Cuidado personal') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Cuidado personal')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Det_Liquido') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Lavado')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Det_Polvo') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Lavado')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Dry Mixes') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Postres')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Galletitas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Galletitas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Golosinas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Golosinas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Infusiones') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Infusiones')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Insecticidas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Insecticidas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Jugos') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Jugos')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Lavavajilla') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Limpieza')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Pequeñas superficies') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Limpieza')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Perfumeria') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Perfumeria')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Premezclas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Panaderia')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Pure Listo') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Almacen')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Salsas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Envasados')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Sopas') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Sopas')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Suavizante') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Suavizante')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Tabaco') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Tabaqueria')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else if (rubro === 'Tocador') {
    let id = 0;
    await db
      .collection('categories')
      .where('name', '==', 'Tocador')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          id = doc.data().id;
        });
      })
      .catch((error) => {
        functions.logger.info('Error getting documents: ', error);
      });
    return id;
  } else {
    return 16;
  }
}

updateStock(
  '/home/rodrigo/Documentos/software/backend/cloud functions/backend/functions/src/public/belgroup.xlsx'
);

// deleteAllProducts();

// getAllCategories();
