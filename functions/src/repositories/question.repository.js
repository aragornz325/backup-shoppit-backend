const { db } = require('../../config/firebase');
const { config } = require('../config/config');
const functions = require('firebase-functions');
const boom = require('@hapi/boom');

class QuestionRepository {
  async createQuestion(payload, productId) {
    await db.collection('questions').add({
      ...payload,
      product_id: productId,
    });
    return { msg: 'ok' };
  }

  async getQuestionsByProductId(productId) {
    let questions = [];
    await db
      .collection('questions')
      .where('product_id', '==', productId)
      .where('answer', '!=', null)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          questions.push({ id: doc.id, ...doc.data() });
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return questions;
  }

  async get5QuestionsByProductId(productId) {
    let questions = [];
    await db
      .collection('questions')
      .where('product_id', '==', productId)
      .where('answer', '!=', null)
      .limit(5)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          questions.push({ id: doc.id, ...doc.data() });
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return questions;
  }
  async updateQuestion(payload, questionId) {
    await db
      .collection('questions')
      .doc(questionId)
      .update({
        ...payload,
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return { msg: 'ok' };
  }

  async getQuestionsBySellerId(seller_id) {
    let questions = [];
    await db
      .collection('questions')
      .where('seller_id', '==', seller_id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          questions.push({ id: doc.id, ...doc.data() });
        });
      })
      .catch((error) => {
        throw boom.badData(error);
      });
    return questions;
  }

  async getQuestionById(questionId) {
    const questionRef = db.collection('questions').doc(questionId);
    const question = await questionRef.get();

    if (!question.exists) {
      functions.logger.error(`question with ID ${questionId} not found`);
      throw boom.badData(`question with ID ${questionId} not found`);
    }

    return question.data();
  }
}
module.exports = QuestionRepository;
