const CartsRepository = require('../repositories/carts.repositories');
const cartsRepository = new CartsRepository();

class CartsServices {
  async createCart(payload) {
    return await cartsRepository.createCart(payload);
  }

  async getAllCarts() {
    return await cartsRepository.getAllCarts();
  }
}

module.exports = CartsServices;
