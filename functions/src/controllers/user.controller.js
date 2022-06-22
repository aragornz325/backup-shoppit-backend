const UserServices = require('../services/user.services');
const service = new UserServices();
const functions = require('firebase-functions');

class UserController {
  async customerClaim(req, res, next) {
    try {
      const setCC = await service.setCustomerClaim();
      return setCC;
    } catch (error) {
      next(error);
    }
  }

  async decodeIdToken(req, res, next) {
    try {
      const { idToken } = req.body;
      const decoded = await service.verifyIdToken(idToken);
      await service.setCustomerClaim(decoded.uid);
      res.json(decoded);
    } catch (error) {
      next(error);
    }
  }

  async createUserWithEmailAndPassword(req, res, next) {
    try {
      const user = service.createUserWithEmailAndPasswordsev(req.body);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async getChannelsAstro(req, res, next) {
    try {
      const check = await service.checkChannelAstroselling();
      res.status(200).send(check);
    } catch (error) {
      next(error);
    }
  }

  async updateSeller(req, res, next) {
    try {
      const body = req.body;
      const { id } = req.params;
      functions.logger.info(id);
      const update = await service.updateSellerServ(body, id);
      res.status(202).send(update);
    } catch (error) {
      next(error);
    }
  }

  async activeSeller(req, res, next) {
    try {
      const body = req.body;
      const { id } = req.params;
      const update = await service.activeSellerServ(body, id);
      res.status(200).send(update);
    } catch (error) {
      next(error);
    }
  }

  async setAdmin(req, res, next) {
    try {
      const body = req.body;
      const update = await service.setAdminServ(body);
      res.status(200).send(update);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
