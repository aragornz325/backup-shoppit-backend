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
};

module.exports = { config };
