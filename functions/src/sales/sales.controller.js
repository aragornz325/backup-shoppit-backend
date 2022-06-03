const SalesServices = require('./sales.services');
const salesServices = new SalesServices();

const addSales = async (req, res, next) => {
  try {
    const body = req.body;
    const newProduct = await salesServices.addSales(body);
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSales,
};
