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
//router.post('/verify-token', validatorHandler(verifyIdToken, 'body'), decodeIdToken );
//router.get('/astroselling', getChannelsAstro);

router.put('/:id/seller', updateSeller);
router.post('/:id/verify-payment', activeSeller);

// app.post('/sign-in', validatorHandler(createUssAndPass, 'body'),
//   createUserWithEmailAndPassword);

module.exports = router;
