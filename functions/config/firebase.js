/* eslint-disable no-undef */
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

//credenciales
initializeApp({
  credential: cert({
    clientEmail: process.env.PROD_CLIENT_EMAIL,
    privateKey: process.env.PROD_PRIVATE_KEY,
    projectId: process.env.PROD_PROJECT_ID,
  }),
  databaseURL: process.env.PROD_DATABASE_URL,
});

const db = getFirestore();
module.exports = { db };
