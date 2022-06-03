const countChild = functions.auth;

exports.countlikechange = functions.database
  .ref('/products/{productsid}')
  .onWrite(async (change) => {
    const collectionRef = change.after.ref.parent;
    const countRef = collectionRef.parent.child('products_count');

    let increment;
    if (change.after.exists() && !change.before.exists()) {
      increment = 1;
    } else if (!change.after.exists() && change.before.exists()) {
      increment = -1;
    } else {
      return null;
    }

    await countRef.transaction((current) => {
      return (current || 0) + increment;
    });
    functions.logger.log('Counter updated.');
    return null;
  });

exports.recountlikes = functions.database
  .ref('/products/{productsid}/products_count')
  .onDelete(async (snap) => {
    const counterRef = snap.ref;
    const collectionRef = counterRef.parent.child('products');

    const messagesData = await collectionRef.once('value');
    return await counterRef.set(messagesData.numChildren());
  });
