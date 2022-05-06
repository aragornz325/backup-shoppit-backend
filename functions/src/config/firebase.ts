import {initializeApp, cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
initializeApp({
  credential: cert("./service.json"),
  databaseURL: "https://ecommerce-mp-default-rtdb.firebaseio.com",
});

const db = getFirestore();
export {db};
