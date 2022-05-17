/* eslint-disable new-parens */

const CartsServices = require('./carts.services');
const cartsServices = new CartsServices();

const createCarts = async (req, res, next) => {
  try {
    const { body } = req.boy;
    const newCart = await cartsServices.createCartsServ(body);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

const getAllcarts = async (req, res, next) => {
  try {
    const allcarts = cartsServices.getAllCartsServ();
    res.status(200).json(allcarts);
  } catch (error) {
    next(error);
  }
};

const getOneCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = cartsServices.getOneCart(id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateCarts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const updtCart = cartsServices.updateCartSrv(id, body);
    res.status(200).json(updtCart);
  } catch (error) {
    next(error);
  }
};

const delOneCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delCart = cartsServices.deleteCart(id);
    res.status(200).json(delCart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCarts,
  getAllcarts,
  getOneCart,
  updateCarts,
  delOneCart
};
