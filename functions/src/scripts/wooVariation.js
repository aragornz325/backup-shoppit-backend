const XLSX = require('xlsx');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

//credenciales
const WooDb = new WooCommerceRestApi({
  url: 'https://shoppit.com.ar/',
  consumerKey: 'ck_833e63a206637b6114e850260ce7430c900d04d0',
  consumerSecret: 'cs_5c7f5311b6ce5fe376da20390524bde428fa81f6',
  version: 'wc/v3',
});

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

async function createVariation(path) {
  const workbook = XLSX.readFile(path);
  const workbookSheets = workbook.SheetNames;

  const sheet = workbookSheets[0];
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  //console.log(dataExcel);
  for (let i = 0; i < dataExcel.length; i++) {
    const data = dataExcel[i];
    let prod;
    const prodInFirestore = await db
      .collection('products')
      .where('sku', '==', data['SKU'])
      .where('spa', '==', data['SAP'])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          prod = doc.data();
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
    //console.log(prod);
    const dataVariation = {
      regular_price:
        data['LISTA GENERAL c/impuestos'] !== undefined
          ? (parseFloat(data['LISTA GENERAL c/impuestos'], 10) * 1.3).toString()
          : 0,

      attributes: [
        {
          id: 0, // color
          name: 'Unidad',
          option: 'Unidad',
        },
      ],
      image: prod.images.forEach((image, i) => {
        return {
          id: i,
          src: image.src,
        };
      }),
      sku: `variation-${data['SKU']}-${data['SAP']}+2`,
      dimensions: {
        length: '5',
        width: '5',
        height: '5',
      },
      weight: '0.3',
      stock_quantity:
        (parseFloat(data['LISTA  X BULTO C/ IMP.'], 10) /
          parseFloat(data['LISTA GENERAL c/impuestos'], 10)) *
        parseInt(data['UNIDADES POR BULTO'], 10),

      manage_stock: true,
      stock_status: 'instock',
      shipping_class: 'zippin',
    };
    const variationWoo = await WooDb.post(
      `products/${prod.id}/variations`,
      dataVariation
    );
    await db
      .collection('products')
      .add({
        ...variationWoo.data,
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        console.log('Document written with ID: ', variationWoo.data);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      }),
      console.log('variation created');
  }
}

createVariation(
  'C:/ittechgroup/backend/functions/src/public/pruebavariaciones.xlsx'
);
