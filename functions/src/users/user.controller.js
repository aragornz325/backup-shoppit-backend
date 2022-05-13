/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const boom = require("@hapi/boom");
const { getAuth } = require("firebase-admin/auth");
const UserServices = require("./user.services");
const service = new UserServices;

const customerClaim = async (req, res, next) => {
  try {
    const setCC = await service.customerClaimServ();
    return setCC;
  } catch (error) {
    next(error);
  }
};


const createUserWithEmailAndPassword = async (req, res, next) => {
  try {
   const user = service.createUserWithEmailAndPasswordsev(req.body)
    res.status(200).send(user);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  customerClaim,
  createUserWithEmailAndPassword
};
