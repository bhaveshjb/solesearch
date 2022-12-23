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

export const sellProduct = {
  body: Joi.object().keys({
    _id: Joi.string().required(),
    size: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

export const storeFrontInactive = {
  body: Joi.object().keys({
    product_id: Joi.string().required(),
  }),
};
export const notFoundForm = {
  body: Joi.object().keys({
    size: Joi.string(),
    brand_name: Joi.string().required(),
    name: Joi.string().required(),
    colourway: Joi.string().required(),
  }),
};

export const makePayment = {
  body: Joi.object().keys({
    product_id: Joi.string().required(),
    size: Joi.string().required(),
    name: Joi.string().required(),
    discount: Joi.string(),
    slug: Joi.string().required(),
    price: Joi.string().required(),
    gst: Joi.string().required(),
    email: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().required(),
    building_name: Joi.string(),
    house_flat_number: Joi.string().required(),
    street_name: Joi.string().required(),
    landmark: Joi.string(),
    city_village: Joi.string(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.string().required(),
  }),
};

export const verifyPayment = {
  body: Joi.object().keys({
    razorpay_payment_id: Joi.string().required(),
    razorpay_order_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
  }),
};
