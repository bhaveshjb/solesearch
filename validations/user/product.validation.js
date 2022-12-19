import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createProduct = {
  body: Joi.object().keys({
    brandName: Joi.string(),
    silhouette: Joi.string(),
    sku: Joi.string(),
    details: Joi.string(),
    color: Joi.string(),
    releaseYear: Joi.string(),
    storyHtml: Joi.string(),
    name: Joi.string(),
    nickname: Joi.string(),
    size: Joi.string(),
    price: Joi.number().integer(),
    imageList: Joi.array().items(Joi.string()),
    productType: Joi.string(),
    mainPictureUrl: Joi.string(),
    slug: Joi.string(),
    productId: Joi.string(),
    objectID: Joi.string(),
    gender: Joi.array().items(Joi.string()),
    sellerEmail: Joi.string().email(),
    productListedOnDryp: Joi.bool(),
    customerOrdered: Joi.bool(),
    productReceivedOnDryp: Joi.bool(),
    authenticityCheck: Joi.bool(),
    productShippedTo: Joi.bool(),
    productDelivered: Joi.bool(),
    rejectProduct: Joi.bool(),
    sold: Joi.bool(),
    inactive: Joi.bool(),
    onSale: Joi.bool(),
  }),
};

export const updateProduct = {
  body: Joi.object().keys({
    brandName: Joi.string(),
    silhouette: Joi.string(),
    sku: Joi.string(),
    details: Joi.string(),
    color: Joi.string(),
    releaseYear: Joi.string(),
    storyHtml: Joi.string(),
    name: Joi.string(),
    nickname: Joi.string(),
    size: Joi.string(),
    price: Joi.number().integer(),
    imageList: Joi.array().items(Joi.string()),
    productType: Joi.string(),
    mainPictureUrl: Joi.string(),
    slug: Joi.string(),
    productId: Joi.string(),
    objectID: Joi.string(),
    gender: Joi.array().items(Joi.string()),
    sellerEmail: Joi.string().email(),
    productListedOnDryp: Joi.bool(),
    customerOrdered: Joi.bool(),
    productReceivedOnDry: Joi.bool(),
    authenticityCheck: Joi.bool(),
    productShippedTo: Joi.bool(),
    productDelivered: Joi.bool(),
    rejectProduct: Joi.bool(),
    sold: Joi.bool(),
    inactive: Joi.bool(),
    onSale: Joi.bool(),
  }),
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const getProductById = {
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const deleteProductById = {
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const getProduct = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedProduct = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.string(),
      limit: Joi.string(),
      sort: Joi.string(),
    })
    .unknown(true),
};
