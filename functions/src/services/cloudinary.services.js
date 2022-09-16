const CloudinaryRepository = require("../repositories/cloudinary.repository");
const cloudinaryRepository = new CloudinaryRepository();
class CloudinaryService {
  async deleteImage (id){
    return await cloudinaryRepository.deleteImage(id);
  }
}

module.exports = CloudinaryService;