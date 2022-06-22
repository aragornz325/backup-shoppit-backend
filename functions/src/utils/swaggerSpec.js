const path = require('path');

const swaggerEdit = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        description: 'SwaggerHub API Auto Mocking',
        url: 'https://virtserver.swaggerhub.com/lovago/apiShoppit/1.0.0',
      },
      {
        description: 'Shoppit Api Rest',
        url: 'http://shoppit_firebase-stg.com',
      },
    ],
    info: {
      description: 'api rest de shoppit by ItTechGroup',
      version: '1.0.0',
      title: 'Shoppit Api Rest',
      contact: {
        email: 'support@shoppit.com',
      },
      license: {
        name: 'NodeJS',
        url: 'https://nodejs.org/es/',
      },
    },
    tags: [
      {
        name: 'products',
        description: 'crud de productos de la app',
      },
      {
        name: 'users',
        description: 'crud de usuarios de la app',
      },
      {
        name: 'categories',
        description: 'crud de categorias de productos en la APP',
      },
      {
        name: 'faqs',
        description: 'crud de preguntas frecuentes en la App',
      },
    ],
    paths: {
      '/faqs': {
        get: {
          summary: 'devuelve las FAQs',
          tags: ['faqs'],
          operationId: 'searchAllFaqs',
          description:
            'devolvera un array de objetos con las faqs disponibles en la aplicacion\n',
          responses: {
            200: {
              description: 'trajo todas las faqs disponibles',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/faqs',
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        post: {
          tags: ['faqs'],
          summary: 'adds an FAQ item',
          operationId: 'addFaq',
          description: 'Adds a FAQ item to the system',
          responses: {
            200: {
              description: 'FAQ created',
            },
          },
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/faqs',
                },
              },
            },
            description: 'faqs item to add',
          },
        },
      },
      '/faqs/{id}': {
        get: {
          summary: 'retorna una FAQ',
          tags: ['faqs'],
          operationId: 'searchOneFAQ',
          description: 'devolvera la pregunta requerida por parametro\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'pass an optional search string for looking up faqs',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'search results matching criteria',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/faqs',
                  },
                },
              },
            },
            404: {
              description: 'FAQ not found',
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        patch: {
          summary: 'actualiza una FAQ',
          tags: ['faqs'],
          operationId: 'updateOneFAQ',
          description: 'actualiza una FAQ, se debe enviar el ID por params\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'id de la FAQ a actualizar',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'objeto con las actualizaciones',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/faqsUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'FAQ actualizada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'product ASd6we46FDr5964dW update',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        delete: {
          summary: 'elimina una categoria',
          tags: ['categories'],
          operationId: 'deleteOneCategory',
          description:
            'elimina la categoria seleccionada sin posibilidad de ser recuperada\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up category',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'categoria eliminado sastifactoriamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'categoria eliminada con exito',
                      },
                      id: {
                        type: 'string',
                        example: 'ASd6we46FDr5964dW',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
      },
      '/categories': {
        get: {
          summary: 'devuelve las categorias',
          tags: ['categories'],
          operationId: 'searchAllCategories',
          description:
            'devolvera un array de objetos con las categorias disponibles en la aplicacion\n',
          responses: {
            200: {
              description: 'trajo todas las categorias disponibles',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/categories',
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        post: {
          tags: ['categories'],
          summary: 'adds an category item',
          operationId: 'addCategory',
          description: 'Adds an item to the system',
          responses: {
            200: {
              description: 'item created',
            },
          },
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/categories',
                },
              },
            },
            description: 'product item to add',
          },
        },
      },
      '/categories/{id}': {
        get: {
          summary: 'retorna un producto',
          tags: ['categories'],
          operationId: 'searchOneCategory',
          description: 'devolvera la categoria indicada por parametro\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up categories',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'search results matching criteria',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/categories',
                  },
                },
              },
            },
            404: {
              description: 'category not found',
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        patch: {
          summary: 'actualiza un producto',
          tags: ['categories'],
          operationId: 'updateOneCategory',
          description:
            'actualiza un producto, se debe enviar el ID por params\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'id de la categoria a actualizar',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'objeto con las actualizaciones',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/updateCategories',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'producto actualizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'product ASd6we46FDr5964dW update',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        delete: {
          summary: 'elimina una FAQ',
          tags: ['faqs'],
          operationId: 'deleteOneFaq',
          description:
            'elimina la FAQ seleccionada sin posibilidad de ser recuperada\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up category',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'FAQ eliminada sastifactoriamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'FAQ eliminada con exito',
                      },
                      id: {
                        type: 'string',
                        example: 'ASd6we46FDr5964dW',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
      },
      '/sales': {
        get: {
          summary: 'devuelve las FAQs',
          tags: ['sales'],
          operationId: 'searchAllsales',
          description:
            'devolvera un array de objetos con las faqs disponibles en la aplicacion\n',
          responses: {
            200: {
              description: 'trajo todas las faqs disponibles',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/faqs',
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        post: {
          tags: ['sales'],
          summary: 'adds an FAQ item',
          operationId: 'addSale',
          description: 'Adds a FAQ item to the system',
          responses: {
            200: {
              description: 'FAQ created',
            },
          },
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/faqs',
                },
              },
            },
            description: 'faqs item to add',
          },
        },
      },
      '/sales/{id}': {
        get: {
          summary: 'retorna una FAQ',
          tags: ['sales'],
          operationId: 'searchOneSale',
          description: 'devolvera la pregunta requerida por parametro\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'pass an optional search string for looking up faqs',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'search results matching criteria',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/faqs',
                  },
                },
              },
            },
            404: {
              description: 'FAQ not found',
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        patch: {
          summary: 'actualiza una FAQ',
          tags: ['sales'],
          operationId: 'updateOneSale',
          description: 'actualiza una FAQ, se debe enviar el ID por params\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'id de la FAQ a actualizar',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'objeto con las actualizaciones',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/faqsUpdate',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'FAQ actualizada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'product ASd6we46FDr5964dW update',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        delete: {
          summary: 'elimina una categoria',
          tags: ['sales'],
          operationId: 'deleteOneSale',
          description:
            'elimina la categoria seleccionada sin posibilidad de ser recuperada\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up category',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'categoria eliminado sastifactoriamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'categoria eliminada con exito',
                      },
                      id: {
                        type: 'string',
                        example: 'ASd6we46FDr5964dW',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
      },
      '/products': {
        get: {
          tags: ['products'],
          summary: 'searche Products',
          operationId: 'searchAllProducts',
          description:
            'devolvera un array de objetos con los productos disponibles en la base de datos\n',
          responses: {
            200: {
              description: 'search results matching criteria',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/products',
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        post: {
          tags: ['products'],
          summary: 'agrega un producto al sistema',
          operationId: 'addInventory',
          description: 'Adds an item to the system',
          responses: {
            200: {
              description: 'item created',
            },
          },
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/products',
                },
              },
            },
            description: 'product item to add',
          },
        },
      },
      '/products/{id}': {
        get: {
          summary: 'retorna un producto',
          tags: ['products'],
          operationId: 'searchOneProduct',
          description:
            'devolvera un array de objetos con los productos disponibles en la base de datos\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up inventory',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'search results matching criteria',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/products',
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        patch: {
          summary: 'actualiza un producto',
          tags: ['products'],
          operationId: 'updateOneProduct',
          description:
            'actualiza un producto, se debe enviar el ID por params\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'id identificatorio del producto a actualizar',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'objeto con las actualizaciones',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/updateProduct',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'producto actualizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'product ASd6we46FDr5964dW update',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        delete: {
          summary: 'borra un producto',
          tags: ['products'],
          operationId: 'deleteOneProduct',
          description:
            'eliminara definitivamente un producto de la base de datos sin posibilidad de ser recuperado\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up inventory',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'producto eliminado sastifactoriamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'producto eliminado con exito',
                      },
                      id: {
                        type: 'string',
                        example: 'ASd6we46FDr5964dW',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
      },
      '/users': {
        get: {
          tags: ['users'],
          summary: 'searches users',
          operationId: 'searchUsers',
          description: 'devolvera un array con todos lo usuarios disponibles\n',
          responses: {
            200: {
              description:
                'la busqueda devolvio sastifactoriamente los usuarios',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/users',
                    },
                  },
                },
              },
            },
            400: {
              description: 'nada en el abase de datos',
            },
          },
        },
        post: {
          tags: ['users'],
          summary: 'adds an user',
          operationId: 'addUsers',
          description: 'Add a user to the system',
          responses: {
            201: {
              description: 'item created',
            },
            400: {
              description: 'invalid input, object invalid',
            },
            409: {
              description: 'an existing item already exists',
            },
          },
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/users',
                },
              },
            },
            description: 'Inventory item to add',
          },
        },
      },
      '/users/{id}': {
        get: {
          summary: 'retorna un usuario',
          tags: ['users'],
          operationId: 'searchOneUser',
          description:
            'devolvera un array de objetos con los productos disponibles en la base de datos\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up inventory',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'search results matching criteria',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/products',
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        patch: {
          summary: 'actualiza un usuario',
          tags: ['users'],
          operationId: 'updateOneUser',
          description:
            'actualiza un producto, se debe enviar el ID por params\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'id identificatorio del producto a actualizar',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            description: 'objeto con las actualizaciones',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/updateProduct',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'producto actualizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'product ASd6we46FDr5964dW update',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
        delete: {
          summary: 'borra un usuario',
          tags: ['users'],
          operationId: 'deleteOneuser',
          description:
            'devolvera un array de objetos con los productos disponibles en la base de datos\n',
          parameters: [
            {
              in: 'path',
              name: 'id',
              description:
                'pass an optional search string for looking up inventory',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'producto eliminado sastifactoriamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'producto eliminado con exito',
                      },
                      id: {
                        type: 'string',
                        example: 'ASd6we46FDr5964dW',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'bad input parameter',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        users: {
          type: 'object',
          required: [
            'addresses',
            'billing',
            'cookie',
            'firstName',
            'identification',
            'isConsultor',
            'isSocial',
            'isVender',
            'lastName',
            'loggedIn',
            'minimum_purchase',
            'nicename',
            'password',
            'picture',
            'product_id_selected_from_web',
            'purchases',
            'recentProducts',
            'sheetsId',
            'storeName',
            'storePicture',
            'url',
            'username',
            'wishList',
          ],
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            addresses: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            billing: {
              type: 'string',
            },
            cookie: {
              type: 'string',
            },
            id: {
              type: 'string',
              minLength: 28,
              maxLength: 28,
              description: 'generado autimaticamente por firebase',
            },
            identification: {
              type: 'object',
              properties: {
                number: {
                  type: 'integer',
                },
                type: {
                  type: 'string',
                },
              },
            },
            isConsultor: {
              type: 'boolean',
            },
            isSocial: {
              type: 'boolean',
            },
            isVender: {
              type: 'boolean',
            },
            loggedIn: {
              type: 'boolean',
            },
            minimum_purchase: {
              type: 'string',
            },
            nicename: {
              type: 'string',
            },
            picture: {
              type: 'string',
              format: 'uri',
              description: 'debe ser una url valida de una imagen',
            },
            product_id_selected_from_web: {
              type: 'string',
            },
            purchases: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            recentProducts: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            sheetsId: {
              type: 'string',
            },
            storeName: {
              type: 'string',
            },
            storePicture: {
              type: 'string',
              format: 'uri',
              description: 'debe ser una url validad de una imagen',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'debe ser una url valida de una imagen',
            },
            username: {
              type: 'string',
            },
            wishlist: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 4,
              maxLength: 12,
            },
            email: {
              type: 'string',
              format: 'email',
            },
          },
        },
        faqs: {
          type: 'object',
          required: ['question', 'answer'],
          properties: {
            question: {
              type: 'string',
              example: 'puedo comprar productos en cantidad?',
            },
            answer: {
              type: 'string',
              example: 'claro!, ese es nuestro objetivo en Shoppit',
            },
          },
        },
        faqsUpdate: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              example: 'puedo comprar productos en cantidad?',
            },
            answer: {
              type: 'string',
              example: 'claro!, ese es nuestro objetivo en Shoppit',
            },
          },
        },
        products: {
          type: 'object',
          required: [
            'available_colors',
            'available_size',
            'categories',
            'description',
            'featured',
            'featuredImage',
            'freeShipping',
            'height',
            'images',
            'in_stock',
            'is_published',
            'longitude',
            'manage_colors',
            'manage_size',
            'manage_stock',
            'name',
            'origin',
            'permalink',
            'plataform',
            'price',
            'productAttributes',
            'quantity_to_cart',
            'regular_price',
            'sale_price',
            'selected_variation',
            'sku',
            'status',
            'stock_quantity',
            'short_description',
            'tags',
            'total_sales',
            'type',
            'updated',
            'variable_products',
            'vendor',
            'volumen',
            'weight',
            'width',
            'withError',
          ],
          properties: {
            id: {
              type: 'string',
            },
            available_colors: {
              type: 'string',
            },
            available_size: {
              type: 'string',
            },
            categories: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            featured: {
              type: 'boolean',
            },
            featuredImage: {
              type: 'string',
            },
            freeShipping: {
              type: 'boolean',
            },
            height: {
              type: 'number',
              example: 10,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'url',
              },
            },
            in_stock: {
              type: 'boolean',
            },
            is_published: {
              type: 'boolean',
              example: true,
            },
            longitude: {
              type: 'integer',
              example: 2,
            },
            manage_colors: {
              type: 'boolean',
            },
            manage_size: {
              type: 'boolean',
            },
            manage_stock: {
              type: 'boolean',
            },
            name: {
              type: 'string',
              example: 'Galaxy S22',
              maxLength: 40,
            },
            origin: {
              type: 'string',
              maxLength: 20,
              example: 'URS',
            },
            permalink: {
              type: 'string',
              format: 'url',
            },
            plataform: {
              type: 'string',
              maxLength: 5,
              example: 'AWS',
            },
            price: {
              type: 'integer',
              format: 'float',
              example: 250000.25,
            },
            productAttributes: {
              type: 'string',
            },
            quantity_to_cart: {
              type: 'string',
            },
            regular_price: {
              type: 'integer',
              format: 'positive',
            },
            sale_price: {
              type: 'integer',
              format: 'positive',
            },
            selected_variation: {
              type: 'string',
            },
            sku: {
              type: 'integer',
            },
            status: {
              type: 'string',
            },
            stock_quantity: {
              type: 'integer',
              format: 'positive',
            },
            short_description: {
              type: 'string',
              maxLength: 250,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['tecno', 'celulares', 'samsung'],
            },
            total_sales: {
              type: 'integer',
            },
            type: {
              type: 'string',
              example: 'brand new',
            },
            updated: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            variable_products: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            vendor: {
              type: 'object',
              properties: {
                minimum_purchase: {
                  type: 'integer',
                },
                name: {
                  type: 'string',
                },
                picture: {
                  type: 'string',
                  format: 'uri',
                },
                storeName: {
                  type: 'string',
                },
                vendor_id: {
                  type: 'string',
                  format: 'alphanumeric',
                  description: 'id generado por firebase',
                },
              },
            },
            volumen: {
              type: 'integer',
            },
            weight: {
              type: 'integer',
            },
            width: {
              type: 'integer',
            },
            withError: {
              type: 'boolean',
            },
          },
        },
        updateProduct: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            available_colors: {
              type: 'string',
            },
            available_size: {
              type: 'string',
            },
            categories: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            featured: {
              type: 'boolean',
            },
            featuredImage: {
              type: 'string',
            },
            freeShipping: {
              type: 'boolean',
            },
            height: {
              type: 'number',
              example: 10,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'url',
              },
            },
            in_stock: {
              type: 'boolean',
            },
            is_published: {
              type: 'boolean',
              example: true,
            },
            longitude: {
              type: 'integer',
              example: 2,
            },
            manage_colors: {
              type: 'boolean',
            },
            manage_size: {
              type: 'boolean',
            },
            manage_stock: {
              type: 'boolean',
            },
            name: {
              type: 'string',
              example: 'Galaxy S22',
              maxLength: 40,
            },
            origin: {
              type: 'string',
              maxLength: 20,
              example: 'URS',
            },
            permalink: {
              type: 'string',
              format: 'url',
            },
            plataform: {
              type: 'string',
              maxLength: 5,
              example: 'AWS',
            },
            price: {
              type: 'integer',
              format: 'float',
              example: 250000.25,
            },
            productAttributes: {
              type: 'string',
            },
            quantity_to_cart: {
              type: 'string',
            },
            regular_price: {
              type: 'integer',
              format: 'positive',
            },
            sale_price: {
              type: 'integer',
              format: 'positive',
            },
            selected_variation: {
              type: 'string',
            },
            sku: {
              type: 'integer',
            },
            status: {
              type: 'string',
            },
            stock_quantity: {
              type: 'integer',
              format: 'positive',
            },
            short_description: {
              type: 'string',
              maxLength: 250,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['tecno', 'celulares', 'samsung'],
            },
            total_sales: {
              type: 'integer',
            },
            type: {
              type: 'string',
              example: 'brand new',
            },
            updated: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            variable_products: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            vendor: {
              type: 'object',
              properties: {
                minimum_purchase: {
                  type: 'integer',
                },
                name: {
                  type: 'string',
                },
                picture: {
                  type: 'string',
                  format: 'uri',
                },
                storeName: {
                  type: 'string',
                },
                vendor_id: {
                  type: 'string',
                  format: 'alphanumeric',
                  description: 'id generado por firebase',
                },
              },
            },
            volumen: {
              type: 'integer',
            },
            weight: {
              type: 'integer',
            },
            width: {
              type: 'integer',
            },
            withError: {
              type: 'boolean',
            },
          },
        },
        categories: {
          type: 'object',
          required: ['name', 'image'],
          properties: {
            name: {
              type: 'string',
              example: 'zapatillas',
            },
            image: {
              type: 'string',
              format: 'uri',
              example:
                'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2020/04/21/15874673980864.jpg',
            },
          },
        },
        updateCategories: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'zapatillas',
            },
            image: {
              type: 'string',
              format: 'uri',
              example:
                'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2020/04/21/15874673980864.jpg',
            },
          },
        },
        creatSale: {
          type: 'object',
          required: [
            'productId',
            'purchasedAmount',
            'clientId',
            'paymentMethod',
            'amount',
            'currency',
          ],
          properties: {
            productId: {
              type: 'string',
            },
            purchasedAmount: {
              type: 'integer',
            },
            clientId: {
              type: 'string',
            },
            paymentMethod: {
              type: 'string',
            },
            amount: {
              type: 'integer',
            },
            currency: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: [`${path.join(__dirname, './*.js')}`],
};

module.exports = swaggerEdit;
