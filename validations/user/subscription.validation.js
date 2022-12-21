import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createSubscription = {
  body: Joi.object().keys({
    collections: Joi.string(),
    email: Joi.string().email(),
  }),
};
export const subscribe = {
  body: Joi.object().keys({
    collections: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};

export const updateSubscription = {
  body: Joi.object().keys({
    collections: Joi.string(),
    email: Joi.string().email(),
  }),
  params: Joi.object().keys({
    subscriptionId: Joi.objectId().required(),
  }),
};

export const getSubscriptionById = {
  params: Joi.object().keys({
    subscriptionId: Joi.objectId().required(),
  }),
};

export const deleteSubscriptionById = {
  params: Joi.object().keys({
    subscriptionId: Joi.objectId().required(),
  }),
};

export const getSubscription = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedSubscription = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
