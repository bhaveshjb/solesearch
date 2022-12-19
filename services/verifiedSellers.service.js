import { VerifiedSellers } from 'models';

export async function getVerifiedSellersById(id, options) {
  const verifiedSellers = await VerifiedSellers.findById(id, options);
  return verifiedSellers;
}

export async function getOne(query, options) {
  const verifiedSellers = await VerifiedSellers.findOne(query, options);
  return verifiedSellers;
}

export async function getVerifiedSellersList(filter, options) {
  const verifiedSellers = await VerifiedSellers.find(filter, options);
  return verifiedSellers;
}

export async function getVerifiedSellersListWithPagination(filter, options) {
  const verifiedSellers = await VerifiedSellers.paginate(filter, options);
  return verifiedSellers;
}

export async function createVerifiedSellers(body) {
  const verifiedSellers = await VerifiedSellers.create(body);
  return verifiedSellers;
}

export async function updateVerifiedSellers(filter, body, options) {
  const verifiedSellers = await VerifiedSellers.findOneAndUpdate(filter, body, options);
  return verifiedSellers;
}

export async function updateManyVerifiedSellers(filter, body, options) {
  const verifiedSellers = await VerifiedSellers.updateMany(filter, body, options);
  return verifiedSellers;
}

export async function removeVerifiedSellers(filter) {
  const verifiedSellers = await VerifiedSellers.findOneAndRemove(filter);
  return verifiedSellers;
}

export async function removeManyVerifiedSellers(filter) {
  const verifiedSellers = await VerifiedSellers.deleteMany(filter);
  return verifiedSellers;
}
