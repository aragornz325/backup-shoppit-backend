/* eslint-disable import/no-unresolved */
const boom = require('@hapi/boom');
const { serverTimestamp } = require('firebase-admin/firestore');
const { db } = require('../../config/firebase');

class CategoriesService {
  async createCategorie(data) {
    const newCat = await db.collection('categories').add({
      ...data,
    });
    return {
      message: 'category created sucssefully',
      newCat,
    };
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
