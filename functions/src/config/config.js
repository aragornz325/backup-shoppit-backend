require('dotenv').config();

const config = {
  apiKey: process.env.APIKEY,
  idMlAstro: process.env.IDMLASTRO,
  urlPushNotification: process.env.URL_PUSH_NOTIFICATION,
  tokenPushNotification: process.env.TOKEN_PUSH_NOTIFICACION,
  urlAstroselling: process.env.URL_ASTRO,
  email: process.env.EMAIL,
  passEmail: process.env.PASSWORDEMAIL,
  userEmail: process.env.USEREMAIL,
  tokenMP: process.env.ACCESS_TOKEN_MP,
  apiKeyShoppit: process.env.APIKEYSHOPPIT,
  secretJWT: process.env.AUTH_JWT_SECRET,
};

module.exports = { config };
