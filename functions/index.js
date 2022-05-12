const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {logErrors, errorHandler,boomErrorHandler } = require("./src/middlewares/error.handler")
//modulos personalizados
const { productsRoutes } = require("./src/products/products.routes");
const userRoutes = require("./src/users/user.routes");
const UserServices = require("./src/users/user.services")
//nombre
const userService = new UserServices

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


exports.setCustomerClaim = functions.auth
.user()
.onCreate(userService.customerClaimServ)

productsRoutes(app);

userRoutes(app);

exports.api = functions.https.onRequest(app);