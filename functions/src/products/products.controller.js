const express = require("express");
const {db} = require("../../config/firebase");

async function getAll(req, res) {
  try {
    const productsArray = [];
    const products = await db.collection("products").get();
    products.docs.map((prod) => {
      productsArray.push(prod.data());
    });
    res.send(productsArray);
  } catch (error) {
    handleError(res, error);
  }
}

const getProduct = async (req, res) => {
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