import Joi from 'joi';
import enumFields from 'models/enum.model';

Joi.objectId = require('joi-objectid')(Joi);

const codesEmbed = Joi.object().keys({
  code: Joi.string(),
  expirationDate: Joi.date(),
  used: Joi.bool(),
  codeType: Joi.string().valid(...Object.values(enumFields.EnumCodeTypeOfCode)),
});
const facebookProviderEmbed = Joi.object().keys({
  id: Joi.string(),
  token: Joi.string(),
});
const addressEmbed = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  buildingName: Joi.string(),
  houseFlatNumber: Joi.string(),
  streetName: Joi.string(),
  landmark: Joi.string(),
  cityVillage: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  zip: Joi.string(),
  uniqueId: Joi.string(),
});
export const createUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(...Object.values(enumFields.EnumRoleOfUser)),
    codes: Joi.array().items(codesEmbed),
    password: Joi.string(),
    facebookProvider: facebookProviderEmbed,
    firstName: Joi.string(),
    lastName: Joi.string(),
    wishList: Joi.array().items(Joi.string()),
    phone: Joi.string(),
    instagram: Joi.string(),
    shoeSize: Joi.string(),
    isRegistered: Joi.bool(),
    isVerified: Joi.bool(),
    isPassword: Joi.bool(),
    address: Joi.array().items(addressEmbed),
    defaultAddress: Joi.string(),
  }),
};

export const updateUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(...Object.values(enumFields.EnumRoleOfUser)),
    codes: Joi.array().items(codesEmbed),
    password: Joi.string(),
    facebookProvider: facebookProviderEmbed,
    firstName: Joi.string(),
    lastName: Joi.string(),
    wishList: Joi.array().items(Joi.string()),
    phone: Joi.string(),
    instagram: Joi.string(),
    shoeSize: Joi.string(),
    isRegistered: Joi.bool(),
    isVerified: Joi.bool(),
    isPassword: Joi.bool(),
    address: Joi.array().items(addressEmbed),
    defaultAddress: Joi.string(),
  }),
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const getUserById = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const deleteUserById = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const getUser = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedUser = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
