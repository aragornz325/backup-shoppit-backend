const express = require('express');
const router = express.Router();
const QuestionRouter = require('../controllers/question.controller');
const questionRouter = new QuestionRouter();

router.post('', questionRouter.createQuestion);

module.exports = router;
