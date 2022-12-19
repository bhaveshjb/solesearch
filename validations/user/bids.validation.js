import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createBids = {
  body: Joi.object().keys({
    orderId: Joi.string().required(),
    slug: Joi.string(),
    name: Joi.string(),
    size: Joi.string().required(),
    price: Joi.number().integer().required(),
    buyer: Joi.string().email(),
    active: Joi.bool(),
    accepted: Joi.bool(),
    sellerNotified: Joi.bool(),
    buyerNotified: Joi.bool(),
    expiry: Joi.date().required(),
    paymentDeadline: Joi.date(),
    seller: Joi.string().email(),
    completed: Joi.bool(),
  }),
};

export const updateBids = {
  body: Joi.object().keys({
    orderId: Joi.string(),
    slug: Joi.string(),
    name: Joi.string(),
    size: Joi.string(),
    price: Joi.number().integer(),
    buyer: Joi.string().email(),
    active: Joi.bool(),
    accepted: Joi.bool(),
    sellerNotified: Joi.bool(),
    buyerNotified: Joi.bool(),
    expiry: Joi.date(),
    paymentDeadline: Joi.date(),
    seller: Joi.string().email(),
    completed: Joi.bool(),
  }),
  params: Joi.object().keys({
    bidsId: Joi.objectId().required(),
  }),
};

export const getBidsById = {
  params: Joi.object().keys({
    bidsId: Joi.objectId().required(),
  }),
};

export const deleteBidsById = {
  params: Joi.object().keys({
    bidsId: Joi.objectId().required(),
  }),
};

export const getBids = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedBids = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
