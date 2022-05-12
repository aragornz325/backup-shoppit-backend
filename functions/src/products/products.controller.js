const express = require("express");
const {db} = require("../../config/firebase");

async function getAll(req, res) {
  try {
    const products = await productServices.getAllSer();
    console.log("Aca esta tu error");
    res.json(products);
  } catch (error) {
    next(error);
  }
}

function boomErrorHandler(err, req, res, next) {

  if (err?.isBoom) {
    console.log("es un error de boom");
    const {output} = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}
const getProduct = async (req, res, next) => {
  console.log("Aca esta tu error");
  try {
    const {id} = req.params;
    if (!id) return res.status(500).send("Bad request");
    const product = await db.collection("products").doc(id).get();
    if (product.exists) {
      return res.send(product.data());
    } else {
      return res.status(404).send("Not found");
    }
  } catch (error) {
    return handleError(res, error);
  }
};


function handleError(res, err) {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}

module.exports = {
  getAll,
  getProduct
}