import {initializeApp, cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    clientEmail: process.env.client_email,
    privateKey: process.env.private_key,
    projectId: process.env.project_id,
  }),
  databaseURL: "https://ecommerce-mp-default-rtdb.firebaseio.com",
});

const db = getFirestore();
export {db};
