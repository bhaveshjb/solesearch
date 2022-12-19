import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const panelAddProduct = {
  body: Joi.object().keys({
    _id: Joi.string().required(),
    nickname: Joi.string(),
    product_type: Joi.string(),
    gender: Joi.array().items(Joi.string()),
    image_list: Joi.array().items(Joi.string()),
    name: Joi.string(),
    story_html: Joi.string(),
    release_year: Joi.string(),
    details: Joi.string(),
    sku: Joi.string(),
    color: Joi.string(),
    brand_name: Joi.string(),
    silhouette: Joi.string(),
    main_picture_url: Joi.string(),
    slug: Joi.string(),
  }),
};
export const addNewProduct = {
  body: Joi.object().keys({
    nickname: Joi.string(),
    product_type: Joi.string().required(),
    gender: Joi.array().items(Joi.string()),
    name: Joi.string().required(),
    story_html: Joi.string(),
    release_year: Joi.string(),
    details: Joi.string(),
    sku: Joi.string(),
    color: Joi.string(),
    brand_name: Joi.string(),
    silhouette: Joi.string(),
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

export const getProductDetail = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

export const getSelectedProduct = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

export const getRelatedProducts = {
  params: Joi.object().keys({
    brand: Joi.string().required(),
  }),
};

export const sellProduct = {
  body: Joi.object().keys({
    _id: Joi.string().required(),
    size: Joi.string().required(),
    price: Joi.number().required(),
  }),
};
export const confirmSellProduct = {
  body: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
};
export const rejectSellProduct = {
  body: Joi.object().keys({
    id: Joi.objectId().required(),
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
