/* eslint-disable no-undef */
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require('dotenv').config();

//credenciales
initializeApp({
  credential: cert({
    clientEmail: process.env.client_email,
    privateKey: process.env.private_key,
    projectId: process.env.project_id,
  }),
  databaseURL: process.env.database_url,
});

const db = getFirestore();
module.exports = { db };


