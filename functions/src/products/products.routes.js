const {getAll, getProduct} = require("./products.controller");

const productsRoutes = (app) => {
  app.get("/products", getAll);
  // app.post("/products/", createProduct);
  app.get("/products/:id", getProduct);
};

module.exports = {
  productsRoutes,
};
