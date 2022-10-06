const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  error404Handler,
} = require('./src/middlewares/error.handler');
const routerApi = require('./src/routers/index');
const UserController = require('./src/controllers/user.controller');
const userController = new UserController();
const WooCommerceService = require('./src/services/wooCommerce.service');
const wooCommerceService = new WooCommerceService();
//const swaggerUI = require('swagger-ui-express');
//const swaggerJsDoc = require('swagger-jsdoc');
const morgan = require('morgan');
const helmet = require('helmet');
//const swaggerEdit = require('./src/utils/swaggerSpec');
//const swaggerSpec = swaggerEdit;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: true }));
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the API');
});
//app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));
app.get('/status', (req, res) => {
  res.status(200).end('server is running');
});
app.head('/status', (req, res) => {
  res.status(200).end();
});
routerApi(app);

app.use(error404Handler);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

exports.setCustomerClaim = functions.auth
  .user()
  .onCreate((user) => userController.setCustomerClaimToNewUser(user));

exports.createInWooCommerce = functions.firestore
  .document('products/{id}')
  .onCreate((snap, context) => {
    const product = snap.data();
    return wooCommerceService.createProduct(product);
  });

exports.deleteUserFromDb = functions.auth
  .user()
  .onDelete((user) => userController.deleteUserFromDb(user));

exports.api = functions
  .runWith({ timeoutSeconds: 500, memory: '1GB' })
  .https.onRequest(app);
