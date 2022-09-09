//const { db } = require('../../config/firebase');
const axios = require('axios');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
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

const payloadUsersStandart = [
  {
    email: 'usuario1@standart.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario 1',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario2@standart.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario 2',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario3@standart.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario 3',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario4@standart.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario 4',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario5@standart.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario 5',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
];

const payloadUsersWithTrialMembership = [
  {
    email: 'usuario1@trialmembership.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario1 trialMembership',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario2@trialmembership.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario2 trialMembership',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario3@trialmembership.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario2 trialMembership',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario4@trialmembership.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario2 trialMembership',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
  {
    email: 'usuario5@trialmembership.com',
    emailVerified: false,
    password: '123456',
    displayName: 'Usuario2 trialMembership',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  },
];

//registerUser(payload);
const registerStandartWithApi = async (payload) => {
  for (let i = 0; i < payload.length; i++) {
    const user = payload[i];
    try {
      const register = await axios.post(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD2s3gI0TJpwIoZ33WlJdlof5CibLgCRII',
        user
      );
      console.log(`status user${i}`, register.status);
      console.log(`statusText user${i}`, register.statusText);
      console.log(`end user${i}`);
    } catch (error) {
      console.log(error);
    }
  }
  console.log('end');
};

const registerTrialMembershipWithApi = async (payload) => {
  for (let i = 0; i < payload.length; i++) {
    const user = payload[i];
    try {
      const register = await axios.post(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD2s3gI0TJpwIoZ33WlJdlof5CibLgCRII',
        user
      );
      console.log('status register', register.status);
      //console.log('data', register.data);
      console.log('statusText register', register.statusText);

      console.log('transforming customer to seller - trial plan');
      const auth = getAuth();
      console.log('seting customer claim to user');
      await auth.setCustomUserClaims(register.data.localId, {
        role: ['seller'],
      });
      console.log('updateing user');
      const billing = {
        storeName: `Tienda de prueba${i}`,
        phone: '123456789',
        cuit: `00-123456789-0${i}`,
        website: `www.tiendaprueba${i}.com`,
        address: `calle falsa${i}`,
        addressNumber: '123',
        province: 'Buenos Aires',
        postalCode: '1234',
        city: 'CABA',
      };
      const userUpdate = {
        status: 'active',
        billing: { ...billing },
        pagoId: 'no payment, is trial',
        role: 'seller',
        isVender: true,
        activeVender: true,
        user_membership: {
          membership_id: 'eV0jqp9Yg9bNqNWnGgg6',
          due_date: '',
          membership_payments: [
            {
              platform_name: 'free Trial',
              payment_platform_id: 'trial',
              payment_date: Math.floor(Date.now() / 1000),
              payment_status: 'trial',
            },
          ],
        },
      };
      console.log('uptading user');
      const userRef = db.collection('users').doc(register.data.localId);
      userRef.set(userUpdate, { merge: true });
      console.log('create membership history');
      const membershipHistory = {
        membership_id: 'eV0jqp9Yg9bNqNWnGgg6',
        user_id: register.data.localId,
        membership_date: Math.floor(Date.now() / 1000),
      };
      const membershipsRef = db.collection('memberships_history');
      await membershipsRef.add({
        ...membershipHistory,
        createdAt: Math.floor(Date.now() / 1000),
      });
      console.log(`end user${i}`);
    } catch (error) {
      console.log(error);
    }
  }
  console.log('end');
};

registerStandartWithApi(payloadUsersStandart);
registerTrialMembershipWithApi(payloadUsersWithTrialMembership);
