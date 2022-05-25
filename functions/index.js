const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();



const {logErrors, errorHandler,boomErrorHandler, error404Handler } = require("./src/middlewares/error.handler")
//modulos personalizados

const routerApi = require('./src/routes/index')
const UserServices = require('./src/users/user.services');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc'); 
// nombre
const swaggerEdit = require('./src/utils/swaggerSpec')
const userService = new UserServices
const swaggerSpec = swaggerEdit 






const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

app.use(cors({ origin: true }));

routerApi(app);


exports.setCustomerClaim = functions.auth
.user()
.onCreate(userService.customerClaimServ);


app.use(error404Handler);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

exports.api = functions.https.onRequest(app);

//firebase emulators:start --only functions 