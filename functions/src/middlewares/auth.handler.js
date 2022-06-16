const boom = require('@hapi/boom');
const { config } = require('../config/config');

function chequearRoles(...roles) {
  return (req, res, next) => {
    const token = res.locals.decoded;
    console.log(token);
    roles.map((rol) => {
      const hasRole = token.hasOwnProperty(rol);
      console.log(hasRole);
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
    next(boom.unauthorized('need API KEY'));
  }
}

module.exports = { chequearRoles, checkApiKey };
