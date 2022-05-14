const CategoriesService = require('./category.services');
const categoriesService = new CategoriesService;
const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');

class CategoriesController {
  async getCat() {
    try {

    } catch (error) {}
  }

  async getOneCat() {
    try {
    } catch (error) {}
  }

  async createCat(req, res, next) {
    const { body } = req.body;
    try {
      const newCategory = categoriesService.createCategorie(body);
      res.status(200).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  async updateCat() {
    try {
    } catch (error) {}
  }
}

module.exports = CategoriesController;
