const boom = require("@hapi/boom");

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

    next(boom.unauthorized(`you do not have the permissions for this resource`))
  }
}

module.exports = chequearRoles;