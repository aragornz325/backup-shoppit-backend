const express = require('express');
const router = express.Router();

const WishlistService = require('../services/wishlist.service');
const wishlistService = new WishlistService();

const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const id = req.headers['x-user-id'];
      const wishlist = await wishlistService.getWishlistByUserId(id);
      res.status(200).send(wishlist);
    } catch (error) {
      next(error);
    }
  }

  async updateWishlist(req, res, next) {
    try {
      const id = req.headers['x-user-id'];
      const product_id = req.params.id;
      const wishlist = await wishlistService.updateWishlist(id, product_id);
      res.status(200).send(wishlist);
    } catch (error) {
      next(error);
    }
  }

  async deleteWishlist(req, res, next) {
    try {
      const id = req.headers['x-user-id'];
      const product_id = req.params.id;
      const wishlist = await wishlistService.deleteIdfromWishlist(
        id,
        product_id
      );
      res.status(200).send(wishlist);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WishlistController;
