import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

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
export const createTransaction = {
  body: Joi.object().keys({
    buyer: Joi.string().email(),
    razorpayOrderId: Joi.string(),
    success: Joi.bool(),
    isBid: Joi.bool(),
    size: Joi.string(),
    gst: Joi.string(),
    discount: Joi.string(),
    slug: Joi.string(),
    name: Joi.string(),
    price: Joi.number().integer(),
    productId: Joi.string(),
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string(),
    buildingName: Joi.string(),
    houseFlatNumber: Joi.string(),
    streetName: Joi.string(),
    landmark: Joi.string(),
    cityVillage: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zip: Joi.string(),
    address: addressEmbed,
  }),
};

export const updateTransaction = {
  body: Joi.object().keys({
    buyer: Joi.string().email(),
    razorpayOrderId: Joi.string(),
    success: Joi.bool(),
    isBid: Joi.bool(),
    size: Joi.string(),
    gst: Joi.string(),
    discount: Joi.string(),
    slug: Joi.string(),
    name: Joi.string(),
    price: Joi.number().integer(),
    productId: Joi.string(),
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string(),
    buildingName: Joi.string(),
    houseFlatNumber: Joi.string(),
    streetName: Joi.string(),
    landmark: Joi.string(),
    cityVillage: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zip: Joi.string(),
    address: addressEmbed,
  }),
  params: Joi.object().keys({
    transactionId: Joi.objectId().required(),
  }),
};

export const getTransactionById = {
  params: Joi.object().keys({
    transactionId: Joi.objectId().required(),
  }),
};

export const deleteTransactionById = {
  params: Joi.object().keys({
    transactionId: Joi.objectId().required(),
  }),
};

export const getTransaction = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedTransaction = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
