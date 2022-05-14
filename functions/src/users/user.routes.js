// eslint-disable-next-line @typescript-eslint/no-var-requires
const { customerClaim, createUserWithEmailAndPassword } = require('./user.controller');
const { createUser, updateUser, createUssAndPass } = require('../schemas/user.schema');
const validatorHandler = require('../middlewares/validatorHandler');

const userRoutes = (app) => {
  app.get('/user', customerClaim);
  app.post('/signin', validatorHandler(createUssAndPass, 'body'),
    createUserWithEmailAndPassword);
};

// app.patch("/user", validatorHandler(updateUser, "body"), );

module.exports = userRoutes;
