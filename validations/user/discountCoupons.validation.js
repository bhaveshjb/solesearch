import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createDiscountCoupons = {
  body: Joi.object().keys({
    coupon: Joi.string().required(),
    discount: Joi.number().integer(),
    count: Joi.number().integer(),
    active: Joi.bool(),
  }),
};

export const updateDiscountCoupons = {
  body: Joi.object().keys({
    coupon: Joi.string(),
    discount: Joi.number().integer(),
    count: Joi.number().integer(),
    active: Joi.bool(),
  }),
  params: Joi.object().keys({
    discountCouponsId: Joi.objectId().required(),
  }),
};

export const getDiscountCouponsById = {
  params: Joi.object().keys({
    discountCouponsId: Joi.objectId().required(),
  }),
};

export const deleteDiscountCouponsById = {
  params: Joi.object().keys({
    discountCouponsId: Joi.objectId().required(),
  }),
};

export const getDiscountCoupons = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedDiscountCoupons = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
