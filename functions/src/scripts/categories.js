/* eslint-disable no-console */
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
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

const createCategories = async () => {
  let result = [];
  let ids = [];

  console.log('get all categories from db');
  const snapshot = await db.collection('categories').get();
  await snapshot.forEach((doc) => {
    result.push(doc.data());
    ids.push(doc.id);
  });
  console.log(ids);
  console.log('delete all categories from db');
  for (let i = 0; i < ids.length; i++) {
    const delRef = db.collection('categories').doc(ids[i]);
    await delRef.delete();
    console.log(`deleted ${ids[i]}`);
  }

  console.log('delete done');
  const categoriesMock = [
    {
      name: 'Ropa & Accesorios',
      index: 0,
      description: 'Ropa & Accesorios',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/Indumentaria_wiopvd.png',
    },
    {
      name: 'Indumentaria Laboral',
      index: 1,
      description: 'Indumentaria Laboral',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/indumentaria_laboral_i9tkj2.png',
    },
    {
      name: 'Alimentos & Bebidas',
      index: 2,
      description: 'Alimentos & Bebidas',
      image:
        ' https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/alimentos_y_bebidas_wqa8ji.png',
    },
    {
      name: 'Belleza & Cuidado Personal',
      index: 3,
      description: 'Belleza & Cuidado Personal',
      image:
        ' https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/belleza_y_cuidado_personal_wvk6nj.png',
    },
    {
      name: 'Bazar & Casa',
      index: 4,
      description: 'Bazar & Casa',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/hogar_y_deco_f6otnm.png',
    },
    {
      name: 'Entretenimiento',
      index: 5,
      description: 'Entretenimiento',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/videojuegos_axyijv.png',
    },
    {
      name: 'Herramientas',
      index: 6,
      description: 'Herramientas',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/herramientas_nxplfz.png',
    },
    {
      name: 'Tecnología',
      index: 7,
      description: 'Tecnología',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/Group_6_jjt2an.png',
    },
    {
      name: 'Tabaquería',
      index: 8,
      description: 'Tabaquería',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/tabaqueria_vcp6ag.png',
    },
    {
      name: 'Insumos',
      index: 9,
      description: 'Insumos',
      image:
        'https://res.cloudinary.com/devf9b8bv/image/upload/v1661454066/categories/insumos_okepbb.png',
    },
    {
      name: 'otros',
      index: 10,
      description: 'otros',
      image: '',
    },
  ];
  console.log('create new categories');
  categoriesMock.forEach((category) => {
    db.collection('categories').add(category);
    console.log(`created ${category.name}`);
  });
  console.log('script done');
  return result;
};

createCategories();
