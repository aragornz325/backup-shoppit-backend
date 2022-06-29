const UserServices = require('../services/user.services');
const service = new UserServices();

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

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await service.getUserById(id);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const user = await service.getUserByEmail(email);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const body = req.body;
      await service.updateUser(id, body);
      res.status(200).send({ msg: 'update Ok' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
