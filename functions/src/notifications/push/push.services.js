const { getAuth } = require('firebase-admin/auth');
//const { db } = require('../../config/firebase');
require('dotenv').config();
const axios = require('axios');
const boom = require('@hapi/boom');
const admin = require('firebase-admin');

const apikey = process.env.apikey;

class PushServices {
  sendPushServ(body) {
    return { msg: { ...body } };
  }
}

module.exports = PushServices;
