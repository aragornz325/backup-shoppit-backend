const express = require("express");
const CloudinaryController = require("../controllers/cloudinary.controller");
const { checkApiKey, isAuthenticated, isAuthorized } = require("../middlewares/auth.handler");
const router = express.Router();
const controller = new CloudinaryController();
router.delete("/:imageUrl",
  checkApiKey,
  isAuthenticated,
  isAuthorized({
    hasRole: ['admin', 'seller'],
    allowSameUser: true,
  }),
  controller.deleteImage
)

module.exports = router;