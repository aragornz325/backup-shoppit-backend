const CloudinaryService = require("../services/cloudinary.services");
const service = new CloudinaryService();

class CloudinaryController {
  async deleteImage(req, res, next) {
    const id = req.params.imageUrl;
    try {
      const response = await service.deleteImage(id);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CloudinaryController;