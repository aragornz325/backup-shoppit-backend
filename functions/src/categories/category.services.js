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
    // db.collection('categories').add({
    //   ...data,
    // })
    //   .then(function (docRef) { console.log('se agrego la categoria con ID ', docRef.id)})
    //   .catch(function (error) { console.error('error al crear el documento', error)})
    const newCat = await db.collection('categories').add({
      ...data,
    });
    return {
      newCat,
      message: 'category created sucssefully',
    };
  }

  async getOneCategorie(data) {
    const refCat = await db.collection('categories').doc(data).get();
    // console.log(refCat)
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
    console.log(delCat);
    // if (Object.keys(delCat).length === 0) { throw boom.badData(' nothing deleted'); }
    return { message: 'category deleted', delCat };
  }

  async updateCat(data, id) {
    const refUser = db.collection('categories').doc(id);
    // console.log(`category => ${id} se actualiza con ${data}`);
    const updater = await refUser.update(data);
    console.log(updater);
    if (updater._writeTime) {
      return { message: `category ${id} update`, updater };
    }
    throw boom.notImplemented('not updated');
  }
}

module.exports = CategoriesService;

// const getCollection = async ({ path, subCollection = "" }) => {
//     let docs = [];
//     let docsWithSubcollections = [];
//     const q = query(collection(db, path));
//     try {
//       let i = 0;
//       const querySnapshot = await getDocs(q);
//       for (const doc of querySnapshot.docs) {
//         let subCollections = [];

//         if (subCollection.length > 0) {
//           const subRef = collection(db, path, doc.id, subCollection);
//           const qSnap = await getDocs(subRef);
//           qSnap.forEach((d) => subCollections.push({ ...d.data(), id: d.id }));
//           docsWithSubcollections.push({ ...doc.data(), id: doc.id, subcategories: subCollections });
//         } else {
//           docs.push({ ...doc.data(), id: doc.id });
//         }
//         i++;
//       }
//       if (subCollection.length > 1) {
//         return docsWithSubcollections;
//       } else {
//         return docs;
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
