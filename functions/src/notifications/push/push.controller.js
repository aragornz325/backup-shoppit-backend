const PushServices = require('./push.services');
const pushServices = new PushServices();

const sendPush = async (req, res, next) => {
  try {
    const body = req.body;
    const newProduct = await pushServices.sendPushServ(body);
    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendPush,
};
