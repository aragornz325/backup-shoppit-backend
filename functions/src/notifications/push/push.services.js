const { getAuth } = require('firebase-admin/auth');
const { db } = require('../../../config/firebase');
require('dotenv').config();
const axios = require('axios');
const boom = require('@hapi/boom');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const pushUrl = process.env.URL_PUSH_NOTIFICATION;
const pushToken = process.env.TOKEN_PUSH_NOTIFICACION;

class PushServices {
  async sendPushServ(body) {
    const recepRef = db.collection('users').doc(body.user_receptor_id);
    const senderRef = db.collection('users').doc(body.user_sender_id);
    const roomRef = db.collection('rooms').doc(body.room_id);

    const receptor = await recepRef.get();
    const sender = await senderRef.get();
    const room = await roomRef.get();

    if (!sender.exists || !receptor.exists || !room.exists) {
      throw boom.badData('required parameters are missing');
    }
    if (!receptor.data().token_devices) {
      throw boom.badData(
        'The receiving user does not have devices with push notification activated'
      );
    }

    let data = {
      to: receptor.data().token_devices,
      notification: {
        title: sender.data().first_name + ' ' + sender.data().last_name,
        body: 'tienes nuevas notificaciones',
      },
      data: {
        room_id: room.data().id,
      },
    };
    const pushSender = await axios.post(pushUrl, data, {
      headers: {
        Authorization: `bearer ${pushToken}`,
      },
    });

    return pushSender.data;
  }
}

module.exports = PushServices;
