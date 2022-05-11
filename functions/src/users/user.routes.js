const { tryUser } = require("./user.controller");

const userRoutes = (app) => {
  app.get("/user", tryUser);
}


module.exports = userRoutes;