const boom = require('@hapi/boom');
const { db } = require('../../config/firebase');

class CategoriesService {
  async createCategorie(data) {
    let check = '';
    const getC = await db
      .collection('categories')
      .where('name', '==', data.name)
      .get();

    getC.forEach((doc) => {
      check = doc.data();
    });
    if (check.name === data.name) {
      throw boom.conflict('the category already exists');
    }
    const newCat = await db.collection('categories').add({
      ...data,
    });
    return {
      id: newCat.id,
      message: 'category created sucssefully',
    };
  }

  async getOneCategorie(data) {
    const refCat = await db.collection('categories').doc(data).get();
    return refCat.data();
  }

  async getAllCategory() {
    const categoriesArray = [];
    const categories = await db.collection('categories').get();
    categories.docs.map((categ) => {
      categoriesArray.push({ id: categ.id, ...categ.data() });
    });
    return categoriesArray;
  }

  async deleteCat(id) {
    const delCat = await db.collection('categories').doc(id).delete();
    return { message: 'category deleted', delCat };
  }

  async updateCat(data, id) {
    const refUser = db.collection('categories').doc(id);
    const updater = await refUser.update(data);
    if (updater._writeTime) {
      return { message: `category ${id} update`, updater };
    }
    throw boom.notImplemented('not updated');
  }
}

module.exports = CategoriesService;
