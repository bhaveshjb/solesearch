import { Subscription } from 'models';
import { sendEmail } from './email.service';

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
export async function addSubscription(body) {
  const { collections } = body;
  const { email } = body;
  try {
    const subject = 'Subscription to SoleSearchIndia';
    const to = email;
    const text = `"You are subscribed to ${collections} collection on SoleSearch.\nEnjoy shopping"`;
    const subscribed = await Subscription.findOne({ collections, email });
    if (!subscribed) {
      await Subscription.create({ collections, email });
      await sendEmail({ to, subject, text, isHtml: false });
      return { message: 'Subscription added', error: false };
    }
    await sendEmail({ to, subject, text, isHtml: false });
    return { message: 'Subscription added', error: false };
  } catch (e) {
    throw new Error(`addSubscription error: ${e.message}`);
  }
}
