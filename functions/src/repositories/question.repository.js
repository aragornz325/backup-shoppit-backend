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
  async updateQuestion(payload, productId) {
    await db
      .collection('questions')
      .doc(payload.questionId)
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
}
module.exports = QuestionRepository;
