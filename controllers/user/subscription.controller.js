import { subscriptionService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { subscriptionId } = req.params;
  const filter = {
    _id: subscriptionId,
  };
  const options = {};
  const subscription = await subscriptionService.getOne(filter, options);
  return res.send({ results: subscription });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const subscription = await subscriptionService.getSubscriptionList(filter, options);
  return res.send({ results: subscription });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const subscription = await subscriptionService.getSubscriptionListWithPagination(filter, options);
  return res.send({ results: subscription });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const subscription = await subscriptionService.createSubscription(body);
  return res.send({ results: subscription });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { subscriptionId } = req.params;
  const filter = {
    _id: subscriptionId,
  };
  const options = { new: true };
  const subscription = await subscriptionService.updateSubscription(filter, body, options);
  return res.send({ results: subscription });
});

export const remove = catchAsync(async (req, res) => {
  const { subscriptionId } = req.params;
  const filter = {
    _id: subscriptionId,
  };
  const subscription = await subscriptionService.removeSubscription(filter);
  return res.send({ results: subscription });
});
