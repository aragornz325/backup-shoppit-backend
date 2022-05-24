const express = require('express');
const { customerClaim, GetChannelsAstro } = require('./user.controller')
const validatorHandler = require('../middlewares/validatorHandler');
const { verifyIdToken } = require('../schemas/user.schema'); /* DTOs */
const { decodeIdToken } = require('./user.controller');
const router = express.Router();


  router.get('/', customerClaim);
  router.post('/verify-token', validatorHandler(verifyIdToken, 'body'), decodeIdToken)
  router.get('/astroselling', GetChannelsAstro )

  //!No se pueden crear usuarios desde el backend
  //TODO: Revisar si hay alguna forma o sacarlo
  // app.post('/sign-in', validatorHandler(createUssAndPass, 'body'), 
  //   createUserWithEmailAndPassword);


module.exports = router;
