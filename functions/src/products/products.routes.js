/* eslint-disable @typescript-eslint/no-var-requires */
const {getAll, getProduct, AddProduct} = require("./products.controller");
const validatorHandler = require("../middlewares/validatorHandler");
const {createProduct, updateProduct} = require("../schemas/prod.schema")

const productsRoutes = (app) => {
  app.get("/products", getAll);
  app.post("/products/", validatorHandler(createProduct, "body"), AddProduct);
  app.get("/products/:id", getProduct);
};

module.exports = {
  productsRoutes,
};
