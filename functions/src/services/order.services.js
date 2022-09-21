const OrderRepository = require('./../repositories/order.repository');
const orderRepository = new OrderRepository();
const UserRepository = require('./../repositories/user.repository');
const userRepository = new UserRepository();
const ProductsRepository = require('./../repositories/products.repository');
const productsRepository = new ProductsRepository();
const boom = require('@hapi/boom');

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
    const orderExists = await orderRepository.getOrder(id);
    if (!orderExists[0].id) {
      throw boom.badRequest(`Order ${id} not found`);
    }

    order.order_items.forEach((item) => {
      const checkProduct = productsRepository.getProductById(item.product_id);
      if (!checkProduct[0].id) {
        throw boom.badRequest(`Product ${item.product_id} not found`);
      }
    });

    order.order_items.forEach(async (item) => {
      const product = await productsRepository.getProductById(item.product_id);
      item.price = product[0].regular_price;
      let total_quantity = order.order_items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    });

    let amount = 0;
    for (const item of order.order_items) {
      const product = await productsRepository.getProduct(item.product_id);
      amount += product.regular_price * item.quantity;
    }

    const orderData = {
      ...order,
      total_quantity,
      total_price: amount,
      updated_at: Math.floor(Date.now() / 1000),
    };
    return await orderRepository.updateOrder(id, orderData);
  }

  async deleteOrder(id) {
    return await orderRepository.deleteOrder(id);
  }

  async getOrdersBySeller(seller_id, limit, offset) {
    const orders = await orderRepository.getOrdersBySeller(
      seller_id,
      limit,
      offset
    );
    const ordersWithProducts = [];
    for (const order of orders) {
      const owner = await userRepository.getUserById(order.owner_id);

      const orders_items = [];
      for (const product of order.order_items) {
        const productData = await productsRepository.getProductById(
          product.product_id
        );

        const variationfilterd = productData[0].variations.filter(
          (variation) => variation.variation === product.variation
        );
        const details = variationfilterd[0];
        orders_items.push({
          ...details,
          name: productData[0].name,
          product_id: product.product_id,
          quantity: product.quantity,
          status_by_seller: product.status_by_seller,
          status_by_buyer: product.status_by_buyer,
          varition: product.variation,
          price: product.price || productData.price,
          picture: productData[0].images_url[0] || '',
        });
      }
      ordersWithProducts.push({
        id: order.id,
        owner_id: owner.id,
        ownerName: owner.firstName,
        ownerLastname: owner.lastName,
        orders_items: orders_items,
        total_quantity: order.total_quantity,
        created_at: order.created_at,
        updated_at: order.updated_at || null,
        status: order.status,
        total_price: order.total_price,
        seller_id: order.seller_id,
      });
    }
    return ordersWithProducts;
  }
}

module.exports = OrderService;
