const {getAll, getProduct, AddProduct} = require("./products.controller");

const productsRoutes = (app) => {
  app.get("/products", getAll);
  app.post("/products/", AddProduct);
  app.get("/products/:id", getProduct);
};

module.exports = {
  productsRoutes,
};
