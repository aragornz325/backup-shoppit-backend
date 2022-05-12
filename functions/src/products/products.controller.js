/* eslint-disable @typescript-eslint/no-var-requires */
const boom = require("@hapi/boom");
const express = require("express");
const {db} = require("../../config/firebase");
const ProductServices = require("./products.services");
const productServices = new ProductServices;

async function getAll(req, res, next) {
  try {
    const products = productServices.getAllSer();
    return products;
  } catch (error) {
    next();
  }
}

const getProduct = async (req, res, next) => {
  try {
    const {id} = req.params;
    if (!id) {
      throw boom.badData();
    }
    const product = productServices.getProductServ(id);
    return product;
  } catch (error) {
    next();
  }
};


module.exports = {
  getAll,
  getProduct,
};
