const functions = require('firebase-functions');

const WebhooksService = require('../services/webhooks.services');
const webhooksService = new WebhooksService();
const UserServices = require('../services/user.services');
const userServices = new UserServices();

class WebhooksController {
  async woocomerceOrders(req, res, next) {
    try {
      const response = await webhooksService.woocomerceOrders(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async woocomerceUpdateProducts(req, res, next) {
    try {
      const response = await webhooksService.woocomerceUpdateProducts(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async woocomerceCreateProducts(req, res, next) {
    try {
      const response = await webhooksService.woocomerceCreateProducts(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async woocomerceCreateCustomer(req, res, next) {
    try {
      functions.logger.debug(req.headers);
      const response = await userServices.createWoocommerceUser(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WebhooksController;
