/* eslint-disable @typescript-eslint/no-var-requires */
const boom = require("@hapi/boom");
const express = require("express");
const {db} = require("../../config/firebase");
const ProductServices = require("./products.services");
const productServices = new ProductServices;

async function getAll(req, res, next) {
  try {
    const products = await productServices.getAllSer();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

const getProduct = async (req, res, next) => {
   try {
    const {id} = req.params;
    if (!id) {
      throw boom.badData();
    }
    const product = await productServices.getProductServ(id);
    res.status(200).json(product);
  } catch (error) {
    next();
  }
};

const AddProduct = async (req, res, next) => {
  try {
      
    // eslint-disable-next-line new-cap
    const newProduct = await productServices.AddProductServ(req.body);
    console.log(newProduct)
    res.status(200).json(newProduct);
  } catch (error) {
    next();
  }
};

const updateProductCon = async (req, res, next) => {
  try {
    const {id} = req.params
    const body = req.body 
    console.log(id, req.body)
    const productToUpdate = await productServices.updateProductServ(body, id)
    res.status(200).json(productToUpdate)
  } catch(error) {
    next(error)
  }
}


module.exports = {
  getAll,
  getProduct,
  AddProduct,
  updateProductCon
};
