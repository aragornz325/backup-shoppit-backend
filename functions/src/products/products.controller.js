const boom = require('@hapi/boom');
const ProductServices = require('./products.services');
const productServices = new ProductServices();

const getAll = async (req, res, next) => {
  try {
    const limitt = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const allProducts = await productServices.getAllSer(limitt, offset);
    res.status(200).json({
      ...allProducts,
    });
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
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;
    const allAstro = await productServices.getAllAstroProduct(limit, offset);
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

const updateAstroProductCon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updateAstro = await productServices.updateAstroProduct(body, id);
    res.status(200).json(updateAstro);
  } catch (error) {
    next(error);
  }
};

const creteInBatcher = async (req, res, next) => {
  try {
    const { body } = req;
    const newProduct = await productServices.batchCreateProduct(body);
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const deleteInBatcher = async (req, res, next) => {
  try {
    const { body } = req;
    const deleted = await productServices.batchDeleteProduct(body);
    res.status(200).json(deleted);
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
  updateAstroProductCon,
  creteInBatcher,
  deleteInBatcher,
};
