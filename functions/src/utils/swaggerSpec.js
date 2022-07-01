const path = require('path');

const swaggerEdit = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'shoppit API-REST',
      description: 'SHOPPIT SOLID architecture server',
      contact: {
        name: 'API Support',
        url: 'http://www.shoppit.com.ar/support',
        email: 'support@shoppit.com.ar',
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://us-central1-ecommerce-mp.cloudfunctions.net/api',
        description: 'Production server',
      },
      {
        url: 'https://us-central1-shoppit-app-stg.cloudfunctions.net/api',
        description: 'Development server',
      },
    ],
  },
  apis: [`${path.join(__dirname, './*.js')}`],
};

module.exports = swaggerEdit;

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   ApiKeySecurity:
 *     type: apiKey
 *     in: header
 *     name: api
 *   Token:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

// set Seller
/**
 * @swagger
 * path:
 * /users/{id}/seller:
 *  put:
 *    summary: envio de formulario para setear en vendedor
 *    tags: [Users]
 *    description: completa el billing del objeto usuario con los datos obtenidos del formulario, se validan con DTO,
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/UpdateSellerBilling'
 *
 *    security:
 *     - ApiKeySecurity: []
 *    responses:
 *       200:
 *         description: billing updated
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: ok
 *
 *
 *    401:
 *     description: "Error: Unauthorized"
 */

// verify payment
/**
 * @swagger
 * path:
 * /users/{id}/verify-payment:
 *  post:
 *    summary: verifica el pago del vendedor
 *    tags: [Users]
 *    description: verifica el pago del vendedor en la API de mercado pago
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              pagoId:
 *                type: string
 *                example: "2c35awra43a843wa3w3f4w38"
 *    security:
 *     - ApiKeySecurity: []
 *    responses:
 *       200:
 *         description: billing updated
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 *                    example: ok
 *
 *
 *    401:
 *     description: "Error: Unauthorized"
 */

// SCHEMA DE USUARIOS
/**
 *  @swagger
 * components:
 *  schemas:
 *    UpdateSellerBilling:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: email valido del usuario
 *          format: email
 *        firstName:
 *          type: string
 *          description: nombre del usuario
 *        lastName:
 *          type: string
 *          description: apellido del usuario
 *        cuil:
 *          type: integer
 *          description: identificacion numerica del usuario
 *        address:
 *          type: string
 *          description: direccion  postal del usuario
 *        city:
 *          type: string
 *          description: ciudad de residencia
 *        storeName:
 *          type: string
 *          description: Nombre de la tienda
 *        socialMedia:
 *          type: string
 *          description: Redes sociales
 *        website:
 *          type: string
 *          description: pagina web de la tienda
 *      required:
 *        - email
 *        - firstname
 *        - lastname
 *        - cuil
 *        - address
 *        - city
 *        - storeName
 *      example:
 *       #
 *       #
 *       email: "test@test.com"
 *       firstname: "juan"
 *       lastname: "Perez"
 *       cuil: 10200000004
 *       address: "calle falsa 123"
 *       city: "Cordoba"
 *       storename: "test S.A."
 *       socialMedia: "https://www.facebook.com/test"
 *       website: "https://www.test.com"
 * */
