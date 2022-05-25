const { db } = require("../../config/firebase");
const boom = require("@hapi/boom");


class SalesServices {

     addSales(id, body) {
        const checkUser = db.collection('user').add()
    }
}