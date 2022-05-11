const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
//modulos personalizados
const { productsRoutes } = require("./src/products/products.routes");
const userRoutes = require("./src/users/user.routes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));
productsRoutes(app);
userRoutes(app);

exports.api = functions.https.onRequest(app);