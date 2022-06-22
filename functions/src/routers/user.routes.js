const express = require('express');
const UserController = require('../controllers/user.controller');
const usercontroller = new UserController();

//const validatorHandler = require('../middlewares/validatorHandler');
//const { verifyIdToken } = require('../schemas/user.schema'); /* DTOs */
//const { decodeIdToken } = require('./user.controller');
const { masivecustomClaim } = require('../utils/masiveCostumerClaim');
const router = express.Router();

router.get('/masiveclaims', masivecustomClaim);

router.put('/:id/seller', usercontroller.updateSeller);
router.post('/:id/verify-payment', usercontroller.activeSeller);

// app.post('/sign-in', validatorHandler(createUssAndPass, 'body'),
//   createUserWithEmailAndPassword);

module.exports = router;
