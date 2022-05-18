const UserServices = require('./user.services');
const service = new UserServices;

const customerClaim = async (req, res, next) => {
  try {
    const setCC = await service.customerClaimServ();
    return setCC;
  } catch (error) {
    next(error);
  }
};

const decodeIdToken = async(req, res, next) => {
  try {
    const {idToken} = req.body;  
    const decoded = await service.verifyIdToken(idToken);
    const setCustomClaim = await service.customerClaimServ(decoded.uid);
    console.log(setCustomClaim);
    res.json({decoded});
  } catch (error) {
    next(error) 
  }
}

//!No se pueden crear usuarios desde el backend
//TODO: Revisar si hay alguna forma o sacarlo
const createUserWithEmailAndPassword = async (req, res, next) => {
  try {
    const user = service.createUserWithEmailAndPasswordsev(req.body);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  customerClaim,
  createUserWithEmailAndPassword,
  decodeIdToken
};
