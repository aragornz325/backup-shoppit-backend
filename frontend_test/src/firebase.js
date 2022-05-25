import {initializeApp} from "firebase/app"
console.log(process.env.stg_project_id)

const firebaseConfig = {
  apiKey: "AIzaSyD2s3gI0TJpwIoZ33WlJdlof5CibLgCRII",
  authDomain: "shoppit-app-stg.firebaseapp.com",
  databaseURL: "https://shoppit-app-stg-default-rtdb.firebaseio.com",
  projectId: "shoppit-app-stg",
  storageBucket: "shoppit-app-stg.appspot.com",
  messagingSenderId: "279924706620",
  appId: "1:279924706620:web:b2bc051a1c3408e946e239",
  measurementId: "G-FHEYLWDYWQ"
};

//credenciales de staging
export const app = initializeApp(firebaseConfig);