const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');
const CartsServices = require('./carts.services');
const cartsServices = new CartsServices;

const createCarts = async (req, res, next) => {
  try {
    const { body } = req.boy;
    const newCart = await cartsServices.createCartsServ(body);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCarts,
};
