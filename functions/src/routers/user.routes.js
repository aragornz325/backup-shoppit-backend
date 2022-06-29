const express = require('express');
const UserController = require('../controllers/user.controller');
const usercontroller = new UserController();
const { updateUser } = require('../schemas/user.schema');

const {
  isAuthenticated,
  isAuthorized,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');
const { masivecustomClaim } = require('../utils/masiveCostumerClaim');
const router = express.Router();

router.get('/masiveclaims', masivecustomClaim);

router.get('/:id', usercontroller.getUserById);
router.patch(
  '/:id',
  validatorHandler(updateUser, 'body'),
  usercontroller.updateUser
);
router.put(
  '/:id/seller',
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  usercontroller.transformCustomerToSeller
);
router.post(
  '/:id/verify-payment',
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  usercontroller.verifySellerPayment
);

router.get('/', usercontroller.getUserByEmail);

module.exports = router;
