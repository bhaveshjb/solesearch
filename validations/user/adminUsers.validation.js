import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createAdminUsers = {
  body: Joi.object().keys({
    userName: Joi.string(),
    password: Joi.string(),
    authenticated: Joi.bool(),
  }),
};

export const updateAdminUsers = {
  body: Joi.object().keys({
    userName: Joi.string(),
    password: Joi.string(),
    authenticated: Joi.bool(),
  }),
  params: Joi.object().keys({
    adminUsersId: Joi.objectId().required(),
  }),
};

export const getAdminUsersById = {
  params: Joi.object().keys({
    adminUsersId: Joi.objectId().required(),
  }),
};

export const deleteAdminUsersById = {
  params: Joi.object().keys({
    adminUsersId: Joi.objectId().required(),
  }),
};

export const getAdminUsers = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedAdminUsers = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
