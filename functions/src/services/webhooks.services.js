const WebhooksRepository = require('../repositories/webhoooks.repository');
const webhooksRepository = new WebhooksRepository();

class WebhooksService {
  async woocomerceOrders(payload) {
    const response = await webhooksRepository.woocommerceOrders(payload);
    return response;
  }
}

module.exports = WebhooksService;
