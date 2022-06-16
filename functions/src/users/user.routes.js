const express = require('express');
const {
  customerClaim,
  getChannelsAstro,
  updateSeller,
  activeSeller,
} = require('./user.controller');

const validatorHandler = require('../middlewares/validatorHandler');
const { verifyIdToken } = require('../schemas/user.schema'); /* DTOs */
const { decodeIdToken } = require('./user.controller');
const router = express.Router();

router.get('/', customerClaim);
router.post(
  '/verify-token',

  validatorHandler(verifyIdToken, 'body'),
  decodeIdToken
);
router.get('/astroselling', getChannelsAstro);

router.post('/sellerUpdate', updateSeller);
router.post('/sellerSetClaim', activeSeller);

//!No se pueden crear usuarios desde el backend
//TODO: Revisar si hay alguna forma o sacarlo
// app.post('/sign-in', validatorHandler(createUssAndPass, 'body'),
//   createUserWithEmailAndPassword);

module.exports = router;
