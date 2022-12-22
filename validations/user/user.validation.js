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
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  }),
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const addIndividualAddress = {
  params: Joi.object().keys({
    unique_id: Joi.string().required(),
  }),
};

export const addDefaultAddress = {
  params: Joi.object().keys({
    unique_id: Joi.string().required(),
  }),
};

export const addAddress = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    building_name: Joi.string().required(),
    house_flat_number: Joi.string().required(),
    street_name: Joi.string().required(),
    landmark: Joi.string(),
    city_village: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().required(),
  }),
};
export const editAddress = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    building_name: Joi.string().required(),
    house_flat_number: Joi.string().required(),
    street_name: Joi.string().required(),
    landmark: Joi.string(),
    city_village: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().required(),
    unique_id: Joi.string().required(),
  }),
};

export const deleteAddress = {
  body: Joi.object().keys({
    unique_id: Joi.string().required(),
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
export const wishList = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    wishListAction: Joi.boolean().required(),
  }),
};
export const customerSupport = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    phone_number: Joi.string().required(),
    issue_type: Joi.string().required(),
    reference_number: Joi.string().required(),
    description: Joi.string().required(),
  }),
};
