const express = require('express');
const router = express.Router();

class fileController {
  async uploadFile(req, res, next) {
    try {
      res.send('upload file');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = fileController;
