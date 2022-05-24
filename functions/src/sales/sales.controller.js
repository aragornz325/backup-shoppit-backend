
const addSales = async (req, res, next) => {
    try {
      const { id } = req.params  
      const { body } = req.body
      const newProduct = await productServices.AddProductServ(req.body);
      res.status(200).json(newProduct);
    } catch (error) {
      next(error);
    }
  };