/* eslint-disable no-unreachable */
const CategoriesService = require('./category.services');
const categoriesService = new CategoriesService();
const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');

const getCat = async (req, res, next) => {
  try {
    const allCategories = await categoriesService.getAllCategory();
    res.status(200).json(allCategories);
  } catch (error) {
    console.log(error);
  }
};

const getOneCat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getOne = await categoriesService.getOneCategorie(id);
    res.status(200).json(getOne);
  } catch (error) {
    next(error);
  }
};

const createCat = async (req, res, next) => {
  console.log('estoy en el controller de categorias');

  try {
    const body = req.body;
    const newCategory = await categoriesService.createCategorie(body);
    res.status(200).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const updateCat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updateCategory = await categoriesService.updateCat(body, id);
    res.status(200).json(updateCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deltecat = await categoriesService.deleteCat(id);
    res.status(200).json(deltecat);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCat,
  getOneCat,
  createCat,
  updateCat,
  deleteCat,
};
