const boom = require('@hapi/boom');
const ProductServices = require('./products.services');
const productServices = new ProductServices();

const getAll = async (req, res, next) => {
  try {
    const products = await productServices.getAllSer();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw boom.badData();
    }
    const product = await productServices.getProductServ(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const newProduct = await productServices.AddProductServ(req.body);
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProductCon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const productToUpdate = await productServices.updateProductServ(body, id);
    res.status(200).json(productToUpdate);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await productServices.deleteProductServ(id);
    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};

const createNewAstroProduct = async (req, res, next) => {
  try {
    const body = req.body;

    const newInAstro = await productServices.createAstroProduct(body);
    res.status(200).json(newInAstro);
  } catch (error) {
    next(error);
  }
};

const getAllAstro = async (req, res, next) => {
  try {
    const allAstro = await productServices.getAllAstroProduct();
    res.status(200).json(allAstro);
  } catch (error) {
    next(error);
  }
};

const getOneAstro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oneAstro = await productServices.getOneAstroProduct(id);
    res.status(200).json(oneAstro);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getProduct,
  addProduct,
  updateProductCon,
  createNewAstroProduct,
  getAllAstro,
  getOneAstro,
  deleteProduct,
};
