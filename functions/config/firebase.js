const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

console.log(process.env.stg_project_id)
initializeApp({
  credential: cert({
    clientEmail: process.env.stg_client_email,
    privateKey: process.env.stg_private_key,
    projectId: process.env.stg_project_id,
  }),
  databaseURL: process.env.database_stg_url,
});

const db = getFirestore();
module.exports = {db};
