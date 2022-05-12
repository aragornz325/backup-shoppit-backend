/* eslint-disable @typescript-eslint/no-var-requires */
const boom = require("@hapi/boom");
const express = require("express");
const {db} = require("../../config/firebase");
const ProductServices = require("./products.services");
const productServices = new ProductServices;

async function getAll(req, res, next) {
  try {
    const products = await productServices.getAllSer();
    return JSON.stringify(products);
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
    const product = await productServices.getProductServ(id);
    return product;
  } catch (error) {
    next();
  }
};

const AddProduct = async (req, res, next) => {
  try {
    const {body} = req.body;
    // eslint-disable-next-line new-cap
    const newProduct = productServices.AddProductServ(body);
    return newProduct;
  } catch (error) {
    next();
  }
};


module.exports = {
  getAll,
  getProduct,
  AddProduct,
};
