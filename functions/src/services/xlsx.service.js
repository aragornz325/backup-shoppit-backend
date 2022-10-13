const XLSX = require('xlsx');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();
const functions = require('firebase-functions');

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
  //console.log('workbookSheets', workbookSheets);
  const sheet = workbookSheets[1];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

  for (let i = 0; i < dataExcel.length; i++) {
    const product = dataExcel[i];
    if (!product.SKU || !product.SAP) {
      functions.logger.error(`SKU is missing for product ${product}`);
      continue;
    }
    const payload = {
      name: product['Descripcion'] || 'missing data',
      type: 'grouped',
      regular_price:
        product['LISTA MELI c/impuestos'] !== ''
          ? parseFloat(
              product['LISTA MELI c/impuestos'].split(' ')[1].replace(',', '.'),
              10
            )
          : 0,
      description: product['Rubro'] || 'missing data',
      short_description: product['Rubro'] || 'missing data',
      categories: [
        {
          id: 9,
        },
      ],
      images: [
        {
          src:
            product['Imagen'] ||
            'https://play-lh.googleusercontent.com/_SSevhCxUfU3Q0wr2cAkY7ayt_M6AbLudYkCXQrFicY-i9jL9U8f4q9tyBvuQ60m6VE=w240-h480-rw',
        },
      ],
      sku: product['SKU'] || 'missing data',
      price:
        product['LISTA GENERAL c/impuestos'] !== ''
          ? parseFloat(
              product['LISTA GENERAL c/impuestos']
                .split(' ')[1]
                .replace(',', '.'),
              10
            )
          : 0,
      shipping_required: true,
      status: 'private',
    };

    await db.collection('products').add(payload);
  }
  functions.logger.info('all done');
  return { msg: 'ok' };
}

async function updateStock(path) {
  const workbook = XLSX.readFile(path);
  const workbookSheets = workbook.SheetNames;
  //console.log('workbookSheets', workbookSheets);
  const sheet = workbookSheets[0];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

  for (let i = 0; i < dataExcel.length; i++) {
    const product = dataExcel[i];
    if (!product.SKU) {
      functions.logger.error(
        `SKU is missing for product ${product['Cod.Art']}`
      );
      continue;
    }
    const payload = {
      stock_quantity: parseInt(product['Stock Bultos'], 10) || 0,
    };

    const querySnapshot = await db
      .collection('products')
      .where('sku', '==', product['SKU'])
      .get();
    querySnapshot.forEach((doc) => {
      db.collection('products').doc(doc.id).update(payload);
    });
  }
  functions.logger.info('all done');
  return { msg: 'ok' };
}

updateStock(
  '/home/rodrigo/Documentos/software/backend/cloud functions/backend/functions/src/public/belgroup.xlsx'
);
