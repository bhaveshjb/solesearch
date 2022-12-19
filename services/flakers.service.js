import { Flakers } from 'models';

export async function getFlakersById(id, options) {
  const flakers = await Flakers.findById(id, options);
  return flakers;
}

export async function getOne(query, options) {
  const flakers = await Flakers.findOne(query, options);
  return flakers;
}

export async function getFlakersList(filter, options) {
  const flakers = await Flakers.find(filter, options);
  return flakers;
}

export async function getFlakersListWithPagination(filter, options) {
  const flakers = await Flakers.paginate(filter, options);
  return flakers;
}

export async function createFlakers(body) {
  const flakers = await Flakers.create(body);
  return flakers;
}

export async function updateFlakers(filter, body, options) {
  const flakers = await Flakers.findOneAndUpdate(filter, body, options);
  return flakers;
}

export async function updateManyFlakers(filter, body, options) {
  const flakers = await Flakers.updateMany(filter, body, options);
  return flakers;
}

export async function removeFlakers(filter) {
  const flakers = await Flakers.findOneAndRemove(filter);
  return flakers;
}

export async function removeManyFlakers(filter) {
  const flakers = await Flakers.deleteMany(filter);
  return flakers;
}
