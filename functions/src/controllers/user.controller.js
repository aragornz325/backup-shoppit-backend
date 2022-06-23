const UserServices = require('../services/user.services');
const service = new UserServices();
const functions = require('firebase-functions');

class UserController {
  async setCustomerClaimToNewUser(user) {
    try {
      await service.setCustomerClaimToUser(user);
      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  async transformCustomerToSeller(req, res, next) {
    try {
      const body = req.body;
      const { id } = req.params;
      functions.logger.info(id);
      const update = await service.transformCustomerToSeller(body, id);
      res.status(202).send(update);
    } catch (error) {
      next(error);
    }
  }

  async verifySellerPayment(req, res, next) {
    try {
      const body = req.body;
      const { id } = req.params;
      const update = await service.verifySellerPayment(body, id);
      res.status(200).send(update);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
