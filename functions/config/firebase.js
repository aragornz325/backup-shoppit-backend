const firebase = require("firebase");
const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

console.log(process.env.stg_project_id)



//credenciales de staging
initializeApp({
  credential: cert({
    clientEmail: process.env.stg_client_email,
    privateKey: process.env.stg_private_key,
    projectId: process.env.stg_project_id,
  }),
  databaseURL: process.env.database_stg_url,
});

//credenciales de prod
// initializeApp({
//   credential: cert({
//     clientEmail: process.env.client_email,
//     privateKey: process.env.private_key,
//     projectId: process.env.project_id,
//   }),
//   databaseURL: process.env.database_prod_url,
// });

const db = getFirestore();
module.exports = {db};
