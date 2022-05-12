/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* const {getAuth} = require("firebase-admin/auth"); */
const UserServices = require("./user.services");
const service = new UserServices;

const customerClaim = async (req, res, next) => {
  try {
    const setCC = await service.customerClaimServ();
    return setCC;
  } catch (error) {
    next();
  }
};

module.exports = {
  customerClaim,
};
