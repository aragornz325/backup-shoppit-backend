const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
//const methodOverride = require('method-override')

const {logErrors, errorHandler,boomErrorHandler, error404Handler } = require("./src/middlewares/error.handler")
//modulos personalizados
const { faqsRoutes } = require('./src/faqs/faqs.router')
const { productsRoutes } = require('./src/products/products.routes');
const { categoriesRoutes } = require('./src/categories/category.router');
const userRoutes = require('./src/users/user.routes');
const UserServices = require('./src/users/user.services');
// nombre
const userService = new UserServices

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));

exports.setCustomerClaim = functions.auth
  .user()
  .onCreate(userService.customerClaimServ);

categoriesRoutes(app);

productsRoutes(app);

userRoutes(app);

faqsRoutes(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use(error404Handler);

exports.api = functions.https.onRequest(app);

//firebase emulators:start --only functions 