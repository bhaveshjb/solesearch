import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createFlakers = {
  body: Joi.object().keys({
    restrictedUntil: Joi.date().required(),
    email: Joi.string().email(),
  }),
};

export const updateFlakers = {
  body: Joi.object().keys({
    restrictedUntil: Joi.date(),
    email: Joi.string().email(),
  }),
  params: Joi.object().keys({
    flakersId: Joi.objectId().required(),
  }),
};

export const getFlakersById = {
  params: Joi.object().keys({
    flakersId: Joi.objectId().required(),
  }),
};

export const deleteFlakersById = {
  params: Joi.object().keys({
    flakersId: Joi.objectId().required(),
  }),
};

export const getFlakers = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedFlakers = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
