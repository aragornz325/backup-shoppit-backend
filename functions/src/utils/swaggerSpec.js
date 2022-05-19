const path = require('path');

const swaggerSpecdef = {
    definition: {
        openapi: "3.0.0"
    },
    info: {
            title: "Shoppit APIREST",
            description: "API REST support for Shoppit Web and mobile version",
            termsOfService: "http://shoppit.com/terms/",
            contact: {
              name: "API Support",
              url: "http://www.shoppit.com/support",
              email: "support@shoppit.com"
            },
            license: {
              name: "It-TechGroup",
              url: "https://www.ittechgroup.com/licenses/LICENSE-2.0.html"
            },
            version: "1.0.1",
            servers: [
            {
                name: "Shoppit API Support",
                url: "http://localhost:5001/shoppit-app-stg/us-central1/api",
                email: "support@shoppit.com",
            }
            ]
          },
        apis: [`${path.join(__dirname, "../products/products.routes.js")}`],
} 


const swaggerSpectTwo = {
  definition: {
  openapi: "3.0.0",
  info: {
      "title": "soy Hostel App Express-Postgres API",
      "description": "servidor de arquitectura SOLID para Soy Hostel",
      "contact": {
      "name": "API Support",
      "url": "http://www.soyhostel.com/support",
      "email": "soyhostel@gmail.com"
      },
      "version": "1.0.0"
  },
  servers:[{
      "url": "https://back-end-1407.herokuapp.com",
      "description": "Production server"
  },
  {
      "url": "https://backpfhenryv2.herokuapp.com",
      "description": "Development server"
  }
  ]
  },
  apis: [`${path.join(__dirname, "./*.js")}`]
}








module.exports = swaggerSpectTwo