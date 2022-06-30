const express = require('express');
const UserController = require('../controllers/user.controller');
const usercontroller = new UserController();

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');
const { masivecustomClaim } = require('../utils/masiveCostumerClaim');
const router = express.Router();

router.get('/masiveclaims', masivecustomClaim);

router.get('/:id', checkApiKey, usercontroller.getUserById);
router.patch(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  usercontroller.updateUser
);
router.put(
  '/:id/seller',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  usercontroller.transformCustomerToSeller
);
router.post(
  '/:id/verify-payment',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  usercontroller.verifySellerPayment
);

module.exports = router;
