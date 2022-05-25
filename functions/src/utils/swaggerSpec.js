const path = require('path');

const swaggerEdit = {
    "definition" : {
        "openapi": "3.0.0",
        "info": {
          "title": "Shoppit Api Rest",
          "description": "api rest de shoppit by ItTechGroup",
          "contact": {
            "email": "support@shoppit.com"
          },
          "license": {
            "name": "NodeJS",
            "url": "https://nodejs.org/es/"
          },
          "version": "1.0.0"
        },
        "servers": [
          {
            "url": "https://firebase.shoppitApp.com",
            "description": "firebase de produccion"
          },
          {
            "url": "http://shoppit_firebase-stg.com",
            "description": "firebase stg - dev"
          }
        ],
        "tags": [
          {
            "name": "products",
            "description": "crud de productos de la app"
          },
          {
            "name": "users",
            "description": "crud de usuarios de la app"
          },
          {
            "name": "categories",
            "description": "crud de categorias de productos en la APP"
          },
          {
            "name": "faqs",
            "description": "crud de preguntas frecuentes en la App"
          }
        ],
        "paths": {
          "/faqs": {
            "get": {
              "tags": [
                "faqs"
              ],
              "summary": "devuelve las FAQs",
              "description": "devolvera un array de objetos con las faqs disponibles en la aplicacion\n",
              "operationId": "searchAllFaqs",
              "responses": {
                "200": {
                  "description": "trajo todas las faqs disponibles",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/faqs"
                        }
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "post": {
              "tags": [
                "faqs"
              ],
              "summary": "adds an FAQ item",
              "description": "Adds a FAQ item to the system",
              "operationId": "addFaq",
              "requestBody": {
                "description": "faqs item to add",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/faqs"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "FAQ created"
                }
              }
            }
          },
          "/faqs/{id}": {
            "get": {
              "tags": [
                "faqs"
              ],
              "summary": "retorna una FAQ",
              "description": "devolvera la pregunta requerida por parametro\n",
              "operationId": "searchOneFAQ",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up faqs",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "search results matching criteria",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/faqs"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                },
                "404": {
                  "description": "FAQ not found"
                }
              }
            },
            "delete": {
              "tags": [
                "categories"
              ],
              "summary": "elimina una categoria",
              "description": "elimina la categoria seleccionada sin posibilidad de ser recuperada\n",
              "operationId": "deleteOneCategory",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up category",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "categoria eliminado sastifactoriamente",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "patch": {
              "tags": [
                "faqs"
              ],
              "summary": "actualiza una FAQ",
              "description": "actualiza una FAQ, se debe enviar el ID por params\n",
              "operationId": "updateOneFAQ",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "id de la FAQ a actualizar",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "requestBody": {
                "description": "objeto con las actualizaciones",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/faqsUpdate"
                    }
                  }
                },
                "required": true
              },
              "responses": {
                "200": {
                  "description": "FAQ actualizada",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_1"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            }
          },
          "/categories": {
            "get": {
              "tags": [
                "categories"
              ],
              "summary": "devuelve las categorias",
              "description": "devolvera un array de objetos con las categorias disponibles en la aplicacion\n",
              "operationId": "searchAllCategories",
              "responses": {
                "200": {
                  "description": "trajo todas las categorias disponibles",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/categories"
                        }
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "post": {
              "tags": [
                "categories"
              ],
              "summary": "adds an category item",
              "description": "Adds an item to the system",
              "operationId": "addCategory",
              "requestBody": {
                "description": "product item to add",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/categories"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "item created"
                }
              }
            }
          },
          "/categories/{id}": {
            "get": {
              "tags": [
                "categories"
              ],
              "summary": "retorna un producto",
              "description": "devolvera la categoria indicada por parametro\n",
              "operationId": "searchOneCategory",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up categories",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "search results matching criteria",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/categories"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                },
                "404": {
                  "description": "category not found"
                }
              }
            },
            "delete": {
              "tags": [
                "faqs"
              ],
              "summary": "elimina una FAQ",
              "description": "elimina la FAQ seleccionada sin posibilidad de ser recuperada\n",
              "operationId": "deleteOneFaq",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up category",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "FAQ eliminada sastifactoriamente",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_2"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "patch": {
              "tags": [
                "categories"
              ],
              "summary": "actualiza un producto",
              "description": "actualiza un producto, se debe enviar el ID por params\n",
              "operationId": "updateOneCategory",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "id de la categoria a actualizar",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "requestBody": {
                "description": "objeto con las actualizaciones",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/updateCategories"
                    }
                  }
                },
                "required": true
              },
              "responses": {
                "200": {
                  "description": "producto actualizado",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_1"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            }
          },
          "/products": {
            "get": {
              "tags": [
                "products"
              ],
              "summary": "searche Products",
              "description": "devolvera un array de objetos con los productos disponibles en la base de datos\n",
              "operationId": "searchAllProducts",
              "responses": {
                "200": {
                  "description": "search results matching criteria",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/products"
                        }
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "post": {
              "tags": [
                "products"
              ],
              "summary": "agrega un producto al sistema",
              "description": "Adds an item to the system",
              "operationId": "addInventory",
              "requestBody": {
                "description": "product item to add",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/products"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "item created"
                }
              }
            }
          },
          "/products/{id}": {
            "get": {
              "tags": [
                "products"
              ],
              "summary": "retorna un producto",
              "description": "devolvera un array de objetos con los productos disponibles en la base de datos\n",
              "operationId": "searchOneProduct",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up inventory",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "search results matching criteria",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/products"
                        }
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "delete": {
              "tags": [
                "products"
              ],
              "summary": "borra un producto",
              "description": "eliminara definitivamente un producto de la base de datos sin posibilidad de ser recuperado\n",
              "operationId": "deleteOneProduct",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up inventory",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "producto eliminado sastifactoriamente",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_3"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "patch": {
              "tags": [
                "products"
              ],
              "summary": "actualiza un producto",
              "description": "actualiza un producto, se debe enviar el ID por params\n",
              "operationId": "updateOneProduct",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "id identificatorio del producto a actualizar",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "requestBody": {
                "description": "objeto con las actualizaciones",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/updateProduct"
                    }
                  }
                },
                "required": true
              },
              "responses": {
                "200": {
                  "description": "producto actualizado",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_1"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            }
          },
          "/users": {
            "get": {
              "tags": [
                "users"
              ],
              "summary": "searches users",
              "description": "devolvera un array con todos lo usuarios disponibles\n",
              "operationId": "searchUsers",
              "responses": {
                "200": {
                  "description": "la busqueda devolvio sastifactoriamente los usuarios",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/users"
                        }
                      }
                    }
                  }
                },
                "400": {
                  "description": "nada en el abase de datos"
                }
              }
            },
            "post": {
              "tags": [
                "users"
              ],
              "summary": "adds an user",
              "description": "Add a user to the system",
              "operationId": "addUsers",
              "requestBody": {
                "description": "Inventory item to add",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/users"
                    }
                  }
                }
              },
              "responses": {
                "201": {
                  "description": "item created"
                },
                "400": {
                  "description": "invalid input, object invalid"
                },
                "409": {
                  "description": "an existing item already exists"
                }
              }
            }
          },
          "/users/{id}": {
            "get": {
              "tags": [
                "users"
              ],
              "summary": "retorna un usuario",
              "description": "devolvera un array de objetos con los productos disponibles en la base de datos\n",
              "operationId": "searchOneUser",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up inventory",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "search results matching criteria",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/products"
                        }
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "delete": {
              "tags": [
                "users"
              ],
              "summary": "borra un usuario",
              "description": "devolvera un array de objetos con los productos disponibles en la base de datos\n",
              "operationId": "deleteOneuser",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "pass an optional search string for looking up inventory",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "producto eliminado sastifactoriamente",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_3"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            },
            "patch": {
              "tags": [
                "users"
              ],
              "summary": "actualiza un usuario",
              "description": "actualiza un producto, se debe enviar el ID por params\n",
              "operationId": "updateOneUser",
              "parameters": [
                {
                  "name": "id",
                  "in": "path",
                  "description": "id identificatorio del producto a actualizar",
                  "required": true,
                  "style": "simple",
                  "explode": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ],
              "requestBody": {
                "description": "objeto con las actualizaciones",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/updateProduct"
                    }
                  }
                },
                "required": true
              },
              "responses": {
                "200": {
                  "description": "producto actualizado",
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/inline_response_200_1"
                      }
                    }
                  }
                },
                "400": {
                  "description": "bad input parameter"
                }
              }
            }
          }
        },
        "components": {
          "schemas": {
            "users": {
              "required": [
                "addresses",
                "billing",
                "cookie",
                "firstName",
                "identification",
                "isConsultor",
                "isSocial",
                "isVender",
                "lastName",
                "loggedIn",
                "minimum_purchase",
                "nicename",
                "password",
                "picture",
                "product_id_selected_from_web",
                "purchases",
                "recentProducts",
                "sheetsId",
                "storeName",
                "storePicture",
                "url",
                "username",
                "wishList"
              ],
              "type": "object",
              "properties": {
                "firstName": {
                  "type": "string"
                },
                "lastName": {
                  "type": "string"
                },
                "addresses": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "billing": {
                  "type": "string"
                },
                "cookie": {
                  "type": "string"
                },
                "id": {
                  "maxLength": 28,
                  "minLength": 28,
                  "type": "string",
                  "description": "generado autimaticamente por firebase"
                },
                "identification": {
                  "$ref": "#/components/schemas/users_identification"
                },
                "isConsultor": {
                  "type": "boolean"
                },
                "isSocial": {
                  "type": "boolean"
                },
                "isVender": {
                  "type": "boolean"
                },
                "loggedIn": {
                  "type": "boolean"
                },
                "minimum_purchase": {
                  "type": "string"
                },
                "nicename": {
                  "type": "string"
                },
                "picture": {
                  "type": "string",
                  "description": "debe ser una url valida de una imagen",
                  "format": "uri"
                },
                "product_id_selected_from_web": {
                  "type": "string"
                },
                "purchases": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "recentProducts": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "sheetsId": {
                  "type": "string"
                },
                "storeName": {
                  "type": "string"
                },
                "storePicture": {
                  "type": "string",
                  "description": "debe ser una url validad de una imagen",
                  "format": "uri"
                },
                "url": {
                  "type": "string",
                  "description": "debe ser una url valida de una imagen",
                  "format": "uri"
                },
                "username": {
                  "type": "string"
                },
                "wishlist": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "password": {
                  "maxLength": 12,
                  "minLength": 4,
                  "type": "string",
                  "format": "password"
                },
                "email": {
                  "type": "string",
                  "format": "email"
                }
              }
            },
            "faqs": {
              "required": [
                "answer",
                "question"
              ],
              "type": "object",
              "properties": {
                "question": {
                  "type": "string",
                  "example": "puedo comprar productos en cantidad?"
                },
                "answer": {
                  "type": "string",
                  "example": "claro!, ese es nuestro objetivo en Shoppit"
                }
              }
            },
            "faqsUpdate": {
              "type": "object",
              "properties": {
                "question": {
                  "type": "string",
                  "example": "puedo comprar productos en cantidad?"
                },
                "answer": {
                  "type": "string",
                  "example": "claro!, ese es nuestro objetivo en Shoppit"
                }
              }
            },
            "products": {
              "required": [
                "available_colors",
                "available_size",
                "categories",
                "description",
                "featured",
                "featuredImage",
                "freeShipping",
                "height",
                "images",
                "in_stock",
                "is_published",
                "longitude",
                "manage_colors",
                "manage_size",
                "manage_stock",
                "name",
                "origin",
                "permalink",
                "plataform",
                "price",
                "productAttributes",
                "quantity_to_cart",
                "regular_price",
                "sale_price",
                "selected_variation",
                "short_description",
                "sku",
                "status",
                "stock_quantity",
                "tags",
                "total_sales",
                "type",
                "updated",
                "variable_products",
                "vendor",
                "volumen",
                "weight",
                "width",
                "withError"
              ],
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "available_colors": {
                  "type": "string"
                },
                "available_size": {
                  "type": "string"
                },
                "categories": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "featured": {
                  "type": "boolean"
                },
                "featuredImage": {
                  "type": "string"
                },
                "freeShipping": {
                  "type": "boolean"
                },
                "height": {
                  "type": "number",
                  "example": 10
                },
                "images": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "format": "url"
                  }
                },
                "in_stock": {
                  "type": "boolean"
                },
                "is_published": {
                  "type": "boolean",
                  "example": true
                },
                "longitude": {
                  "type": "integer",
                  "example": 2
                },
                "manage_colors": {
                  "type": "boolean"
                },
                "manage_size": {
                  "type": "boolean"
                },
                "manage_stock": {
                  "type": "boolean"
                },
                "name": {
                  "maxLength": 40,
                  "type": "string",
                  "example": "Galaxy S22"
                },
                "origin": {
                  "maxLength": 20,
                  "type": "string",
                  "example": "URS"
                },
                "permalink": {
                  "type": "string",
                  "format": "url"
                },
                "plataform": {
                  "maxLength": 5,
                  "type": "string",
                  "example": "AWS"
                },
                "price": {
                  "type": "integer",
                  "format": "float"
                },
                "productAttributes": {
                  "type": "string"
                },
                "quantity_to_cart": {
                  "type": "string"
                },
                "regular_price": {
                  "type": "integer",
                  "format": "positive"
                },
                "sale_price": {
                  "type": "integer",
                  "format": "positive"
                },
                "selected_variation": {
                  "type": "string"
                },
                "sku": {
                  "type": "integer"
                },
                "status": {
                  "type": "string"
                },
                "stock_quantity": {
                  "type": "integer",
                  "format": "positive"
                },
                "short_description": {
                  "maxLength": 250,
                  "type": "string"
                },
                "tags": {
                  "type": "array",
                  "example": [
                    "tecno",
                    "celulares",
                    "samsung"
                  ],
                  "items": {
                    "type": "string"
                  }
                },
                "total_sales": {
                  "type": "integer"
                },
                "type": {
                  "type": "string",
                  "example": "brand new"
                },
                "updated": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "variable_products": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "vendor": {
                  "$ref": "#/components/schemas/products_vendor"
                },
                "volumen": {
                  "type": "integer"
                },
                "weight": {
                  "type": "integer"
                },
                "width": {
                  "type": "integer"
                },
                "withError": {
                  "type": "boolean"
                }
              }
            },
            "updateProduct": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "available_colors": {
                  "type": "string"
                },
                "available_size": {
                  "type": "string"
                },
                "categories": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "featured": {
                  "type": "boolean"
                },
                "featuredImage": {
                  "type": "string"
                },
                "freeShipping": {
                  "type": "boolean"
                },
                "height": {
                  "type": "number",
                  "example": 10
                },
                "images": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "format": "url"
                  }
                },
                "in_stock": {
                  "type": "boolean"
                },
                "is_published": {
                  "type": "boolean",
                  "example": true
                },
                "longitude": {
                  "type": "integer",
                  "example": 2
                },
                "manage_colors": {
                  "type": "boolean"
                },
                "manage_size": {
                  "type": "boolean"
                },
                "manage_stock": {
                  "type": "boolean"
                },
                "name": {
                  "maxLength": 40,
                  "type": "string",
                  "example": "Galaxy S22"
                },
                "origin": {
                  "maxLength": 20,
                  "type": "string",
                  "example": "URS"
                },
                "permalink": {
                  "type": "string",
                  "format": "url"
                },
                "plataform": {
                  "maxLength": 5,
                  "type": "string",
                  "example": "AWS"
                },
                "price": {
                  "type": "integer",
                  "format": "float"
                },
                "productAttributes": {
                  "type": "string"
                },
                "quantity_to_cart": {
                  "type": "string"
                },
                "regular_price": {
                  "type": "integer",
                  "format": "positive"
                },
                "sale_price": {
                  "type": "integer",
                  "format": "positive"
                },
                "selected_variation": {
                  "type": "string"
                },
                "sku": {
                  "type": "integer"
                },
                "status": {
                  "type": "string"
                },
                "stock_quantity": {
                  "type": "integer",
                  "format": "positive"
                },
                "short_description": {
                  "maxLength": 250,
                  "type": "string"
                },
                "tags": {
                  "type": "array",
                  "example": [
                    "tecno",
                    "celulares",
                    "samsung"
                  ],
                  "items": {
                    "type": "string"
                  }
                },
                "total_sales": {
                  "type": "integer"
                },
                "type": {
                  "type": "string",
                  "example": "brand new"
                },
                "updated": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "variable_products": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "vendor": {
                  "$ref": "#/components/schemas/products_vendor"
                },
                "volumen": {
                  "type": "integer"
                },
                "weight": {
                  "type": "integer"
                },
                "width": {
                  "type": "integer"
                },
                "withError": {
                  "type": "boolean"
                }
              }
            },
            "categories": {
              "required": [
                "image",
                "name"
              ],
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "example": "zapatillas"
                },
                "image": {
                  "type": "string",
                  "format": "uri",
                  "example": "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2020/04/21/15874673980864.jpg"
                }
              }
            },
            "updateCategories": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "example": "zapatillas"
                },
                "image": {
                  "type": "string",
                  "format": "uri",
                  "example": "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2020/04/21/15874673980864.jpg"
                }
              }
            },
            "inline_response_200": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "categoria eliminada con exito"
                },
                "id": {
                  "type": "string",
                  "example": "ASd6we46FDr5964dW"
                }
              }
            },
            "inline_response_200_1": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "product ASd6we46FDr5964dW update"
                }
              }
            },
            "inline_response_200_2": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "FAQ eliminada con exito"
                },
                "id": {
                  "type": "string",
                  "example": "ASd6we46FDr5964dW"
                }
              }
            },
            "inline_response_200_3": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "producto eliminado con exito"
                },
                "id": {
                  "type": "string",
                  "example": "ASd6we46FDr5964dW"
                }
              }
            },
            "users_identification": {
              "type": "object",
              "properties": {
                "number": {
                  "type": "integer"
                },
                "type": {
                  "type": "string"
                }
              },
              "example": null
            },
            "products_vendor": {
              "type": "object",
              "properties": {
                "minimum_purchase": {
                  "type": "integer"
                },
                "name": {
                  "type": "string"
                },
                "picture": {
                  "type": "string",
                  "format": "uri"
                },
                "storeName": {
                  "type": "string"
                },
                "vendor_id": {
                  "type": "string",
                  "description": "id generado por firebase",
                  "format": "alphanumeric"
                }
              },
              "example": null
            }
          }
        }
  },
  "apis": [`${path.join(__dirname, "./*.js")}`],
}





module.exports = swaggerEdit