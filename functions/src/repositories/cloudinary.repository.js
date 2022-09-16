const { default: axios } = require("axios");

class CloudinaryRepository {
  async deleteImage(id) {
    const url = `https://api.cloudinary.com/v1_1/devf9b8bv/resources/image/upload?public_ids[]=${id}`
    console.log(id);
    const response = await axios.delete(url, {
      headers: {
        "Authorization": "Basic Mzg3NzM3NDEzNTM0NTE0OnY4ejlKZ191R1dnNmhBYjlKd2Mtd2ZrQkQxTQ="
      }
    })
    return response.data;
  }
}

module.exports = CloudinaryRepository;