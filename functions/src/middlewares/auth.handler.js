const boom = require('@hapi/boom');
const { config } = require('../config/config');
const functions = require('firebase-functions');

function chequearRoles(...roles) {
  return (req, res, next) => {
    const token = res.locals.decoded;
    functions.logger.info(token);
    roles.map((rol) => {
      const hasRole = token.hasOwnProperty(rol);
      functions.logger.info(hasRole);
      if (hasRole) {
        next();
      }
    });

    next(
      boom.unauthorized(`you do not have the permissions for this resource`)
    );
  };
}
function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKeyShoppit) {
    next();
  } else {
    next(boom.unauthorized('unauthorized'));
  }
}

module.exports = { chequearRoles, checkApiKey };
