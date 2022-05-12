// eslint-disable-next-line @typescript-eslint/no-var-requires
const {customerClaim, createUserWithEmailAndPassword} = require("./user.controller");

const userRoutes = (app) => {
  app.get("/user", customerClaim);
  app.post("/signin", createUserWithEmailAndPassword);

};


module.exports = userRoutes;
