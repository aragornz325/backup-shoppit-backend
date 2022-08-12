const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const usercontroller = new UserController();

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const { querySchema } = require('../schemas/user.schema');
const validatorHandler = require('../middlewares/validatorHandler');
const { masivecustomClaim } = require('../utils/masiveCostumerClaim');

router.get('', checkApiKey, usercontroller.getUsers);
router.get('/masiveclaims', masivecustomClaim);

router.get(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  usercontroller.getUserById
);

router.patch(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  usercontroller.updateUser
);
router.patch('/:id/changesuscription', usercontroller.changeSuscription);

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

router.patch(
  '/:id/deactivate',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  usercontroller.deactivateUser
);

router.patch(
  '/:id/activate',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  usercontroller.activateUser
);

router.get(
  '/:id/products',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  usercontroller.getUserProductsByOwner
);

router.post('/register', checkApiKey, usercontroller.registerUser);

module.exports = router;
