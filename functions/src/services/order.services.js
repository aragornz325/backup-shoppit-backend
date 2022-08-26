const OrderRepository = require('./../repositories/order.repository');
const orderRepository = new OrderRepository();

class OrderService {
  async createOrder(order) {
    return await orderRepository.createOrder(order);
  }

  async getOrders(limit, offset) {
    return await orderRepository.getOrders(limit, offset);
  }

  async getOrder(id) {
    return await orderRepository.getOrder(id);
  }

  async updateOrder(id, order) {
    return await orderRepository.updateOrder(id, order);
  }

  async deleteOrder(id) {
    return await orderRepository.deleteOrder(id);
  }
}

module.exports = OrderService;
