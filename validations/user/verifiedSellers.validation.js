import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createVerifiedSellers = {
  body: Joi.object().keys({
    email: Joi.string().email(),
  }),
};

export const updateVerifiedSellers = {
  body: Joi.object().keys({
    email: Joi.string().email(),
  }),
  params: Joi.object().keys({
    verifiedSellersId: Joi.objectId().required(),
  }),
};

export const getVerifiedSellersById = {
  params: Joi.object().keys({
    verifiedSellersId: Joi.objectId().required(),
  }),
};

export const deleteVerifiedSellersById = {
  params: Joi.object().keys({
    verifiedSellersId: Joi.objectId().required(),
  }),
};

export const getVerifiedSellers = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedVerifiedSellers = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
