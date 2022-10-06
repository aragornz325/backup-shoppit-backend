require('dotenv').config();

const config = {
  urlPushNotification: process.env.URL_PUSH_NOTIFICATION,
  tokenPushNotification: process.env.TOKEN_PUSH_NOTIFICACION,
  email: process.env.EMAIL,
  private_key_id: process.env.PRIVATE_KEY_ID,
  passEmail: process.env.PASSWORDEMAIL,
  userEmail: process.env.USEREMAIL,
  tokenMP: process.env.ACCESS_TOKEN_MP,
  apiKeyShoppit: process.env.APIKEYSHOPPIT,
  secretJWT: process.env.AUTH_JWT_SECRET,
  urlConsult: process.env.URL_CONSULTA_MP,
  tokenConsult: process.env.TOKEN_CONSULTA_MP,
  accesTokenMp: process.env.ACCESS_TOKEN_MP,
  urlConsultaPagos: process.env.URL_CONSULTA_PAGO_MP,
  backUrlMp: process.env.BACK_URL,
  apiWeb: process.env.API_WEB_FIREBASE,
  algolia: {
    algoliaUserApiSearch: process.env.ALGOLIA_API_SEARCH,
    algoliaUserAppId: process.env.ALGOLIA_APP_ID,
    algoliaUsersIndexName: process.env.ALGOLIA_USER_INDEX_NAME,
    algoliaProductsApiSerch: process.env.ALGOLIA_API_SEARCH_PRODUCTS,
    algoliaProductsAppId: process.env.ALGOLIA_APP_ID_PRODUCTS,
    algoliaProductsIndexName: process.env.ALGOLIA_PRODUCT_INDEX_NAME,
  },
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY,
  project_id: process.env.PROJECT_ID,
  trial_membership_id: process.env.TRIAL_MEMBERSHIP_ID,
  wooCommerce: {
    consummerKey: process.env.WOO_CLAVE_DE_CLIENTE,
    consummerSecret: process.env.WOO_CLAVE_SECRETA_DE_CLIENTE,
  },
};

module.exports = { config };
