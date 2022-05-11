const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv/config");
//modulos personalizados
const { productsRoutes } = require("./products/products.routes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));
productsRoutes(app);

api = functions.https.onRequest(app);

