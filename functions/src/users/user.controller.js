const UserServices = require('./user.services');
const service = new UserServices();

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
      //TODO: Sacar esta funcion, es solo de prueba
      await service.setCustomerClaim(decoded.uid);
      res.json(decoded);
    } catch (error) {
      next(error);
    }
  }

  //!No se pueden crear usuarios desde el backend
  //TODO: Revisar si hay alguna forma o sacarlo
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
      console.log(id);
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
