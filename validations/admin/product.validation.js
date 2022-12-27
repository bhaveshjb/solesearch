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
export const panelDeleteProduct = {
  body: Joi.object().keys({
    _id: Joi.string().required(),
    slug: Joi.string().required(),
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

export const productDetailsById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
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
export const productsWithFilters = {
  body: Joi.object().keys({
    size: Joi.number(),
    from: Joi.number(),
    query: Joi.object(),
    sort: Joi.object(),
  }),
};
export const productFilterByQuery = {
  body: Joi.object().keys({
    size: Joi.number(),
    from: Joi.number(),
    match: Joi.object().required(),
    sort_by: Joi.object().required(),
  }),
};
export const filters = {
  body: Joi.object().keys({
    query: Joi.object(),
    aggs: Joi.object(),
  }),
};
export const queryResults = {
  params: Joi.object().keys({
    query: Joi.string().required(),
  }),
};
export const search = {
  params: Joi.object().keys({
    index: Joi.string().required(),
    query_string: Joi.string().required(),
    size: Joi.number().required(),
  }),
};
