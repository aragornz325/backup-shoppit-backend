const express = require('express');
const router = express.Router();
const PrductsController = require('../controllers/products.controller');
const productsController = new PrductsController();
const CategoriesController = require('../controllers/categories.controller');
const categoriesController = new CategoriesController();
const QuestionController = require('../controllers/question.controller');
const questionController = new QuestionController();

const {
  createProduct,
  updateProduct,
  getOne,
} = require('../schemas/prod.schema');
const {
  createQuestion,
  updateQuestion,
} = require('../schemas/questions.schema');

const {
  createCategory,
  updateCategory,
} = require('../schemas/category.schema');
const {
  isAuthenticated,
  isAuthorized,
  checkApiKey,
} = require('../middlewares/auth.handler');

const validatorHandler = require('../middlewares/validatorHandler');

router.get('', checkApiKey, productsController.getProducts);
router.post(
  '/categories',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  validatorHandler(createCategory, 'body'),
  categoriesController.createCategory
);
router.get(
  '/bycaterory',
  checkApiKey,
  productsController.getProductsByCategory
);
router.get('/categories', checkApiKey, categoriesController.getAllCategories);
router.get('/search', productsController.getProductWithAlgolia);
router.get('/ownership/:id', checkApiKey, productsController.getproductByOwner);
router.patch(
  '/categories/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  validatorHandler(updateCategory, 'body'),
  categoriesController.updateCategory
);
router.get(
  '/categories/:id',
  checkApiKey,
  categoriesController.getCategoryById
);
router.delete(
  '/categories/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: false,
  }),
  categoriesController.deleteCategory
);

router.post(
  '/batch/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.initSheet
);
router.get(
  '/batch/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.getProductSheet
);
router.post(
  '/:id/questions',
  checkApiKey,
  validatorHandler(createQuestion, 'body'),
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: true,
  }),
  questionController.createQuestion
);
router.get(
  '/:id/questions',
  checkApiKey,
  questionController.getQuestionsByProductId
);
router.put(
  '/:id/questions',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin'],
    allowSameUser: true,
  }),
  validatorHandler(updateQuestion, 'body'),
  questionController.updateQuestion
);

router.get('/:id', checkApiKey, productsController.getProductById);

router.post(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  validatorHandler(createProduct, 'body'),
  productsController.createProduct
);
router.put(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.updateProduct //TODO: validatorHandler(updateProduct, 'body')
);
router.delete(
  '/:id',
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: false,
  }),
  productsController.deleteProduct
);

module.exports = router;
