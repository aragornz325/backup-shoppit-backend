const express = require('express');
const router = express.Router();
const MembershipsController = require('../controllers/memberships.controller');
const membershipscontroller = new MembershipsController();
const {
  createMembershipDTO,
  updateMembershipDTO,
} = require('../schemas/memberships.schema');

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');

router.get('/', membershipscontroller.getMemberships);
router.post(
  '/',
  validatorHandler(createMembershipDTO, 'body'),
  membershipscontroller.createMembership
);
router.get('/:id', membershipscontroller.getMembership);
router.patch(
  '/:id',
  validatorHandler(updateMembershipDTO, 'body'),
  membershipscontroller.updateMembership
);
router.delete('/:id', membershipscontroller.deleteMembership);

module.exports = router;
