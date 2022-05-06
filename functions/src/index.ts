import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import {productsRoutes} from "./products/products.routes";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: true}));
productsRoutes(app);

export const api = functions.https.onRequest(app);

