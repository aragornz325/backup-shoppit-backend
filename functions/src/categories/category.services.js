/* eslint-disable import/no-unresolved */
const boom = require("@hapi/boom");
const { serverTimestamp, QuerySnapshot } = require("firebase-admin/firestore");
const { db } = require("../../config/firebase");

class CategoriesService {
  async createCategorie(data) {
    let check = "";
    const getC = await db
      .collection("categories")
      .where("name", "==", data.name)
      .get();

    getC.forEach((doc) => {
      check = doc.data();
    });
    if (check.name === data.name) {
      throw boom.conflict('the category already exists');
    }

    const newCat = await db.collection("categories").add({
      ...data,
    });
    return {
      newCat,
      message: 'category created sucssefully',
    };
  }

  async getOneCategorie(data) {
    const refCat = await db.collection('categories').doc(data).get();
    console.log(refCat)
    return refCat.data();
  }

  async getAllCategory() {
    const categoriesArray = [];
    const categories = await db.collection("categories").get();
    categories.docs.map((categ) => {
      categoriesArray.push({ id: categ.id, ...categ.data() });
    });
    return categoriesArray;
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
