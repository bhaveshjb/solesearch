import crypto from 'crypto';

const generateProductId = (data) => {
  const h = crypto.createHash('ripemd160');
  let hashString;
  if (data.nickname && data.sku) {
    hashString = `${data.name} + ${data.nickname} + ${data.sku} + ${Date.now()}`;
  } else {
    hashString = `${data.name} + ${Date.now()}`;
  }
  h.update(hashString);
  const productId = h.digest('hex');
  return productId;
};
module.exports = generateProductId;
