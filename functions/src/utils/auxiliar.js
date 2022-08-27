async function chunckarray(array, size) {
  const chunked = [];
  let index = 0;
  while (index < array.length) {
    chunked.push(array.slice(index, size + index));
    index += size;
  }
  return chunked;
}

async function compareObj(productInDb, item) {
  const aKeys = Object.keys(productInDb).sort();
  const bKeys = Object.keys(item).sort();
  const aValues = Object.values(productInDb).sort();
  const bValues = Object.values(item).sort();
  if (aValues.length !== bValues.length) {
    return false;
  }
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  if (aKeys.join('') !== bKeys.join('')) {
    return false;
  }
  if (aValues.join('') !== bValues.join('')) {
    return false;
  }
  for (let i = 0; i < aValues.length; i++) {
    if (aValues[i] !== bValues[i]) {
      return false;
    }
  }
  for (let i = 0; i < aKeys.length; i++) {
    if (productInDb[aKeys[i]] !== item[bKeys[i]]) {
      return false;
    }
  }
  return true;
}

async function changeOrderStatus(order) {
  if (
    order.status_by_buyer === 'approved' &&
    order.status_by_seller === 'approved'
  ) {
    return { ...order, status: 'approved' };
  }
  if (
    order.status_by_buyer === 'approved' &&
    order.status_by_seller === 'pendig'
  ) {
    return { ...order, status: 'pending' };
  }
  if (
    order.status_by_buyer === 'pending' &&
    order.status_by_seller === 'approved'
  ) {
    return { ...order, status: 'pending' };
  }
  if (
    order.status_by_buyer === 'pending' &&
    order.status_by_seller === 'pending'
  ) {
    return { ...order, status: 'pending' };
  }
  if (
    order.status_by_buyer === 'rejected' &&
    order.status_by_seller === 'approved'
  ) {
    return { ...order, status: 'rejected' };
  }
  if (
    order.status_by_buyer === 'rejected' &&
    order.status_by_seller === 'pending'
  ) {
    return { ...order, status: 'rejected' };
  }
  if (
    order.status_by_buyer === 'rejected' &&
    order.status_by_seller === 'rejected'
  ) {
    return { ...order, status: 'rejected' };
  }
  if (
    order.status_by_buyer === 'approved' &&
    order.status_by_seller === 'rejected'
  ) {
    return { ...order, status: 'rejected' };
  }
  if (
    order.status_by_buyer === 'pending' &&
    order.status_by_seller === 'rejected'
  ) {
    return { ...order, status: 'rejected' };
  }
  return order;
}

module.exports = {
  changeOrderStatus,
  chunckarray,
  compareObj,
};
