const OrderRepository = require('./../repositories/order.repository');
const orderRepository = new OrderRepository();
const UserRepository = require('./../repositories/user.repository');
const userRepository = new UserRepository();
const ProductsRepository = require('./../repositories/products.repository');
const productsRepository = new ProductsRepository();

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

  async getOrdersBySeller(sellerId, limit, offset) {
    const orders = await orderRepository.getOrdersBySeller(
      sellerId,
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
          //image: productData.images_url[0] || '',
        });
      }
      ordersWithProducts.push({
        id: order.id,
        owner: {
          id: owner.id,
          name: owner.firstName,
          lastname: owner.lastName,
        },
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
