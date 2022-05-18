const { customerClaim, createUserWithEmailAndPassword } = require('./user.controller');
const { createUssAndPass } = require('../schemas/user.schema'); /* DTOs */
const validatorHandler = require('../middlewares/validatorHandler');

const userRoutes = (app) => {
  app.get('/user', customerClaim);
  app.post('/sign-in', validatorHandler(createUssAndPass, 'body'),
    createUserWithEmailAndPassword);
};

module.exports = userRoutes;
