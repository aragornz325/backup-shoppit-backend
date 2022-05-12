// eslint-disable-next-line @typescript-eslint/no-var-requires
const {customerClaim} = require("./user.controller");

const userRoutes = (app) => {
  app.get("/user", customerClaim);
};


module.exports = userRoutes;
