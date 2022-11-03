const WebhooksService = require('../services/webhooks.services');
const webhooksService = new WebhooksService();

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
}

module.exports = WebhooksController;
