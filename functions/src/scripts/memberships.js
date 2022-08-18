//const { db } = require('../../config/firebase');
const axios = require('axios');

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

const createMemberships = async () => {
  let result = [];
  let ids = [];

  const snapshot = await db.collection('memberships').get();
  snapshot.forEach((doc) => {
    result.push(doc.data());
    ids.push(doc.id);
  });

  for (let i = 0; i < ids.length; i++) {
    const delRef = db.collection('memberships').doc(ids[i]);
    await delRef.delete();
  }

  const membershipsMock = [
    {
      membership_benefits: [
        'Exposición alta',
        'Soporte via Whatsapp',
        'integracion con Mercadopago',
        'Publicación de productos y ventas sin limites',
      ],
      payment_url: '',
      createdAt: { _seconds: 1659128135, _nanoseconds: 923000000 },
      memberships_discounts: [100],
      payment_cycle: 'trimestral',
      name: 'Premium',
      description: 'free trial membershp',
      price: 16200,
      active: false,
      id: 'RgZsIIKESOSLj4eS6AwR',
    },
    {
      active: false,
      price: 19200,
      payment_cycle: 'semestral',
      createdAt: { _seconds: 1659128127, _nanoseconds: 541000000 },
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084815db1a80181630e027803ae',
      membership_benefits: [
        'Exposición máxima',
        'Atención personalizada via whatsapp y telefono',
        'Integración con mercadopago',
        'Publicación de productos y ventas sin limites',
      ],
      memberships_discounts: [100],
      description: 'premium semestral',
      name: 'Premium',
      id: 'WoMgTJLpvtIGQIhm7wNY',
    },
    {
      memberships_discounts: [100],
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084813ff7c601816309fa4e10b6',
      description: 'free trial membershp',
      price: 18000,
      createdAt: { _seconds: 1659128142, _nanoseconds: 953000000 },
      name: 'Premium',
      payment_cycle: 'mensual',
      active: false,
      membership_benefits: [
        'Exposición alta',
        'Soporte via Whatsapp',
        'integracion con Mercadopago',
        'Publicacion de Productos y Ventas sin limites',
      ],
      id: 'n72WW1hPLjtsiHRpWAxI',
    },
    {
      description: 'professional mensual',
      name: 'Professional',
      membership_benefits: [
        'Exposición Máxima ',
        'Atención personalizada via Whatsapp y Telefono',
        'integracion con mercadopago',
        'Publicacion de productos y ventas sin limites',
      ],
      memberships_discounts: [0],
      active: false,
      price: 24000,
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084815db1a80181630b397b03a9',
      payment_cycle: 'mensual',
      createdAt: { _seconds: 1659128269, _nanoseconds: 637000000 },
      id: 'N1OcXCjS38QuOUUREWhW',
    },
    {
      memberships_discounts: [100],
      price: 21600,
      name: 'Professional',
      description: 'professional trimestral',
      payment_cycle: 'trimestral',
      membership_benefits: [
        'Exposición máxima',
        'Atencion Personalizada via Whatsapp y Telefono',
        'Integracion con Mercadopago',
        'Publicación de Productos y Ventas sin limites',
      ],
      active: false,
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084815db1a80181630c874903ac',
      createdAt: { _seconds: 1659128288, _nanoseconds: 531000000 },
      id: 'lUVFJvj7sC6u0YRVackP',
    },
    {
      active: false,
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084813ff78601816312c4711066',
      payment_cycle: 'semestral',
      createdAt: { _seconds: 1659128298, _nanoseconds: 964000000 },
      memberships_discounts: [100],
      membership_benefits: [
        'Exposición máxima',
        'Atención personalizada via Whatsapp y telefono',
        'Integracion con Mercadopago',
        'Publicacion de Productos y Ventas sin limites',
      ],
      name: 'Professional',
      price: 19200,
      description: 'professional semestral',
      id: 'xuqjl1ublE4CA6pCOOYa',
    },
    {
      active: false,
      payment_cycle: 'trimestral',
      createdAt: { _seconds: 1659128187, _nanoseconds: 649000000 },
      name: 'Standard',
      price: 9600,
      memberships_discounts: [0],
      description: 'standart trimestral',
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084813ff7c60181630bc39e10b8',
      membership_benefits: [
        'Exposicion estandar',
        'Soporte via E-mail',
        'Integracion con Mercadopago',
        'Publicación de productos y ventas sin limites',
      ],
      id: 'Z2Ulpo7jvR0jhn1r3FVK',
    },
    {
      memberships_discounts: [100],
      price: 9600,
      active: false,
      membership_benefits: [
        'Exposición estandart',
        'Soporte via E-mail',
        'Integracion con Mercadopago',
        'Publicación de productos y ventas sin limites',
      ],
      name: 'Standard',
      createdAt: { _seconds: 1659128177, _nanoseconds: 227000000 },
      payment_cycle: 'semestral',
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084813ff7c60181630cdfff10ba',
      description: 'standart trimestral',
      id: 'jbDRYwVD6gPfDFTDOdZV',
    },
    {
      memberships_discounts: [100],
      payment_url:
        'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084815db1a801815ed0e8440116',
      membership_benefits: [
        'Exposición estandar',
        'Soporte via E-mail',
        'Integracion con Mercadopago',
        'Publicacion de Productos y ventas sin limite',
      ],
      price: 12000,
      payment_cycle: 'mensual',
      description: 'standart mensual',
      active: false,
      createdAt: { _seconds: 1659128165, _nanoseconds: 40000000 },
      name: 'Standard',
      id: 'lAEDDo2RzRwmx9vAWw7a',
    },
    {
      active: false,
      price: 0,
      memberships_discounts: [100],
      membership_benefits: [
        'Exposicion estandar',
        'Gratis por 120 dias',
        'Publicación de productos y ventas sin limites',
        'Integracion con Mercadopago',
      ],
      payment_url: 'http://foto.jpg',
      payment_cycle: 'mensual',
      name: 'Trial',
      createdAt: { _seconds: 1659128087, _nanoseconds: 569000000 },
      description: 'free trial membershp',
      id: 'eV0jqp9Yg9bNqNWnGgg6',
    },
  ];

  membershipsMock.forEach((membership) => {
    db.collection('memberships').doc(membership.id).set(membership);
  });

  return result;
};

createMemberships();
