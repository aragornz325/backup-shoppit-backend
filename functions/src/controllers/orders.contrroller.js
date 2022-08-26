const OrderService = require('./../services/order.services');
const orderService = new OrderService();

class OrderController {
  async createOrder(req, res, next) {
    try {
      const body = req.body;
      const result = await orderService.createOrder(body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const limit = req.query.limit;
      const offset = req.query.offset;
      const result = await orderService.getOrders(limit, offset);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res, next) {
    try {
      const id = req.params.id;
      const result = await orderService.getOrder(id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const id = req.params.id;
      const body = req.body;
      const result = await orderService.updateOrder(id, body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const id = req.params.id;
      const result = await orderService.deleteOrder(id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
