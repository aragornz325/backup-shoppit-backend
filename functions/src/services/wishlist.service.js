const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const functions = require('firebase-functions');

class WishlistService {
  async getWishlistByUserId(userId) {
    const user = await userRepository.getUserById(userId);
    return user.wishlist;
  }

  async updateWishlist(userId, product_id) {
    const user = await userRepository.getUserById(userId);
    if (!user.wishlist) {
      user.wishlist = [];
    }
    if (user.wishlist.includes(product_id)) {
      functions.logger.info('Product already in wishlist');
      return { msg: 'ok' };
    }
    user.wishlist.push(product_id);
    await userRepository.updateUser(userId, user, true);
    return { msg: 'ok' };
  }

  async deleteIdfromWishlist(userId, product_id) {
    const user = await userRepository.getUserById(userId);
    const index = user.wishlist.indexOf(product_id);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    }
    await userRepository.updateUser(userId, user, true);
    return user.wishlist;
  }
}

module.exports = WishlistService;
