import { Subscription } from 'models';

export async function getSubscriptionById(id, options) {
  const subscription = await Subscription.findById(id, options);
  return subscription;
}

export async function getOne(query, options) {
  const subscription = await Subscription.findOne(query, options);
  return subscription;
}

export async function getSubscriptionList(filter, options) {
  const subscription = await Subscription.find(filter, options);
  return subscription;
}

export async function getSubscriptionListWithPagination(filter, options) {
  const subscription = await Subscription.paginate(filter, options);
  return subscription;
}

export async function createSubscription(body) {
  const subscription = await Subscription.create(body);
  return subscription;
}

export async function updateSubscription(filter, body, options) {
  const subscription = await Subscription.findOneAndUpdate(filter, body, options);
  return subscription;
}

export async function updateManySubscription(filter, body, options) {
  const subscription = await Subscription.updateMany(filter, body, options);
  return subscription;
}

export async function removeSubscription(filter) {
  const subscription = await Subscription.findOneAndRemove(filter);
  return subscription;
}

export async function removeManySubscription(filter) {
  const subscription = await Subscription.deleteMany(filter);
  return subscription;
}
