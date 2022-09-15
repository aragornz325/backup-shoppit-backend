const boom = require('@hapi/boom');
const { getAuth } = require('firebase-admin/auth');
const { config } = require('../config/config');

getAuth().createUser;

async function isAuthenticated(req, res, next) {
  const authorization = req.headers.authorization ?? 'sin token';
  console.log('----------------------->', authorization);
  if (authorization === 'sin token') {
    next(boom.unauthorized('unauthorized / no token'));
  }
  if (!authorization.startsWith('Bearer ')) {
    next(boom.unauthorized('unauthorized / no valid bearer'));
  }
  const split = authorization.split('Bearer ');
  if (split.length !== 2) {
    next(boom.unauthorized('unauthorized / no valid or missing bearer'));
  }
  const token = split[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    };
    return next();
  } catch (error) {
    next(boom.unauthorized('unauthorized / invalid token'));
  }
}

function isAuthorized({ hasRole, allowSameUser }) {
  return (req, res, next) => {
    const { role, uid } = res.locals;
    const id = req.headers['x-user-id'];
    if (allowSameUser && id && uid === id) {
      return next();
    }
    if (hasRole.includes(...role)) {
      next();
    } else {
      next(boom.unauthorized('unauthorized'));
    }
  };
}

function checkApiKey(req, res, next) {
  if (!req.headers['api']) {
    next(boom.unauthorized('unauthorized - need api key'));
  }
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKeyShoppit) {
    next();
  } else {
    next(boom.unauthorized('unauthorized'));
  }
}

module.exports = { checkApiKey, isAuthenticated, isAuthorized };
