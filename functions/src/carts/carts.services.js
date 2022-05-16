/* eslint-disable class-methods-use-this */
const { db } = require('../../config/firebase');

class CartsServices {
  async createCartsServ(data) {
    // db.collection('V').add({
    //   ...data,
    // })
    //   .then(function (docRef) { console.log('se agrego la cart con ID ', docRef.id)})
    //   .catch(function (error) { console.error('error al crear la cart', error)})
    const newCat = await db.collection('carts').add({
      ...data,
    });
    return {
      newCat,
      message: 'category created sucssefully',
    };
  }
}

module.exports = CartsServices;
