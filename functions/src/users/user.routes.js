const { customerClaim } = require('./user.controller')
const validatorHandler = require('../middlewares/validatorHandler');
const { verifyIdToken } = require('../schemas/user.schema'); /* DTOs */
const { decodeIdToken } = require('./user.controller');

const userRoutes = (app) => {
  app.get('/user', customerClaim);
  app.post('/verifyToken', validatorHandler(verifyIdToken, 'body'), decodeIdToken)

  //!No se pueden crear usuarios desde el backend
  //TODO: Revisar si hay alguna forma o sacarlo
  // app.post('/sign-in', validatorHandler(createUssAndPass, 'body'),
  //   createUserWithEmailAndPassword);
};

module.exports = userRoutes;
