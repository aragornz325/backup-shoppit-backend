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

  async deactivateUser(req, res, next) {
    try {
      const { id } = req.params;
      await service.deactivateUser(id);
      res.status(200).send({ msg: 'Ok' });
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req, res, next) {
    try {
      const { id } = req.params;
      await service.activateUser(id);
      res.status(200).send({ msg: 'Ok' });
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req, res, next) {
    try {
      const { email } = req.query;
      if (!email) {
        throw new Error('email is required');
      }
      const user = await service.getUserByEmail(email);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      // let email = undefined;
      // let firstName = undefined;
      // let lastName = undefined;
      // if (req.query.email) {
      //   email = req.query.email;
      // }
      // if (req.query.firstName) {
      //   firstName = req.query.firstName;
      // }
      // if (req.query.lastName) {
      //   lastName = req.query.lastName;
      // }
      // functions.logger.info(
      //   `email:${email} firstName:${firstName} lastName:${lastName}`
      // );
      const query = req.query;
      const user = await service.getOne(query);

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
