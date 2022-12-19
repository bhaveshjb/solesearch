import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Product } from 'models';
import { logger } from '../config/logger';
import { esclient } from '../utils/elasticSearch';

export async function getProductById(id, options) {
  const product = await Product.findById(id, options);
  return product;
}

export async function getOne(query, options) {
  const product = await Product.findOne(query, options);
  return product;
}

export async function getProductList(filter, options) {
  const product = await Product.find(filter, options);
  return product;
}

export async function getProductListWithPagination(filter, options) {
  const product = await Product.paginate(filter, options);
  return product;
}
export async function updateProduct(filter, body, options) {
  try {
    const product = Product.findOneAndUpdate(filter, body, options);
    return product;
  } catch (error) {
    logger.error('error in creating Product:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function createProduct(body) {
  try {
    const product = await esclient.index({ index: 'seller', body });
    return product;
  } catch (error) {
    logger.error('error in creating Product:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
}

export async function getProductDetails(slug) {
  const query = {
    query: {
      match: {
        'slug.keyword': slug,
      },
    },
  };
  const product = await esclient.search({ index: 'seller', body: query });
  return product.hits.hits[0]._source;
}

export async function getProductCollection() {
  const query = {
    size: 50,
    query: {
      match_all: {},
    },
  };
  const product = await esclient.search({ index: 'seller', body: query });
  return product;
}

export async function getSelectedProduct(slug) {
  const query = {
    query: {
      match: {
        'slug.keyword': slug,
      },
    },
    size: 1,
  };
  const product = await esclient.search({ index: 'seller', body: query });
  return product.hits.hits[0];
}

export async function getRelatedProducts(brand) {
  const query = {
    query: {
      match: {
        'slug.keyword': brand,
      },
    },
    size: 8,
  };
  const product = await esclient.search({ index: 'buyer', body: query });
  return product;
}

export async function getProductDetail(productData) {
  const query = {
    query: {
      match: {
        _id: productData._id,
      },
    },
  };
  const product = await esclient.search({ index: 'seller', body: query });
  // console.log('product=> ', product);
  return product.hits.hits[0]._source;
}
export async function sellProductService(productData, userData) {
  const productDetail = await getProductDetail(productData);

  productDetail.seller_email = userData.email;
  productDetail.size = productData.size;
  productDetail.product_listed_on_dryp = false;
  productDetail.customer_ordered = false;
  productDetail.product_received_on_dryp = false;
  productDetail.authenticity_check = false;
  productDetail.product_shipped_to_customer = false;
  productDetail.product_delivered = false;
  productDetail.reject_product = false;
  productDetail.sold = false;
  productDetail.inactive = false;

  await Product.create(productDetail);
  return { message: 'Product added for review' };
}

export async function listProductReview() {
  const filter = {
    product_listed_on_dryp: false,
    reject_product: false,
    inactive: false,
  };
  const product = await Product.find(filter);
  return product;
}
async function getAlgolia(product) {
  // eslint-disable-next-line no-param-reassign
  delete product._id;
  await esclient.index({ index: 'buyer', body: product });
}
export async function sellConfirmation(id) {
  const filter = {
    _id: id,
  };
  const product = await Product.findOneAndUpdate(filter, { product_listed_on_dryp: true }).lean();
  // TODO: send email
  await getAlgolia(product);
  return product;
}
export async function sellDecline(id) {
  const filter = {
    _id: id,
  };
  const product = await updateProduct(filter, { reject_product: true }, { new: true });
  // const product = await Product.findOneAndUpdate(filter, { reject_product: true });
  // TODO: send email
  return product;
}

export async function updateBuyerIndexProducts(slug) {
  try {
    const query = {
      size: 1000,
      query: {
        match: {
          'slug.keyword': slug,
        },
      },
    };
    const product = await esclient.search({ index: 'buyer', body: query });
    return product;
  } catch (error) {
    logger.error('error in updateBuyerIndexProducts:', error.message);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
}
// export async function addProductDetails(user) {
//   // const filter = {
//   //   product_listed_on_dryp: false,
//   //   reject_product: false,
//   //   inactive: false,
//   // };
//   //
//   // const product = await Product.find(filter);
//   // return product;
// }

export async function updateManyProduct(filter, body, options) {
  try {
    const product = Product.updateMany(filter, body, options);
    return product;
  } catch (error) {
    logger.error('error in creating Product:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeProduct(filter) {
  const product = await Product.findOneAndRemove(filter);
  return product;
}

export async function removeManyProduct(filter) {
  const product = await Product.deleteMany(filter);
  return product;
}
