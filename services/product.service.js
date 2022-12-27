import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Bids, Product, Transaction } from 'models';
import { logger } from '../config/logger';
import { esclient } from '../utils/elasticSearch';

const elasticbulk = require('elasticbulk');

async function getOriginalPrice(productPrice, isBid = false) {
  let price = Math.floor(productPrice);
  if (isBid) {
    const shippingCost = 300;
    const shippingCostPlusTaxes = shippingCost + 0.18 * shippingCost;
    price -= shippingCostPlusTaxes;
    price = Math.floor(price / 1.0354);
    const commission = price * 0.1;
    const gst = commission * 0.18;
    price = Math.floor(price - (commission + gst));
  } else {
    const commission = price * 0.1;
    const gst = commission * 0.18;
    price = Math.floor(price - (commission + gst));
  }
  return price;
}

export async function getObjectByProductId(productId) {
  const query = {
    query: {
      match: {
        'product_id.keyword': productId,
      },
    },
  };
  const product = await esclient.search({ index: 'buyer', body: query });
  if (product.hits.total.value === 0) {
    return { found: false };
  }
  const objectId = product.hits.hits[0]._id;
  esclient.delete({ index: 'buyer', id: objectId });
  return { found: true };
}

export async function productUpdate() {
  const slugs = [
    "nike-dunk-low-'varsity-royal'-cu1726100",
    "air-jordan-1-high-og-'lost-and-found'-dz5485612",
    "travis-scott-x-air-jordan-1-low-og-'reverse-mocha'-dm7866162",
    'fragment-design-x-travis-scott-x-air-jordan-1-retro-low-dm7866140',
    "union-la-x-air-jordan-1-retro-high-nrg-'black-toe'-bv1300106",
    "air-jordan-1-mid-se-'black-and-white'-dh6933100",
    "dunk-low-'pure-platinum'-dj6188001",
    'nike-air-force-1-mid-x-off-white-black-do6290-001',
    "nike-sb-dunk-low-'why-so-sad'-dx5549400",
    "union-la-x-dunk-low-'passport-pack---argon'-dj9649400",
    "yeezy-foam-runner-'onyx'-hp8739",
  ];
  slugs.map(async (slug) => {
    await Product.updateMany({ slug }, { on_sale: true });
  });
  return 'Done';
}

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
export async function bulkAdd(index, data) {
  try {
    const products = [];
    data.map((product) => {
      let sku;
      if (product.sku) {
        sku = product.sku.toLowerCase().replace(' ', '-');
      } else {
        sku = '';
      }
      const addData = {
        gender: product.gender,
        slug: `${product.name.toLowerCase().replace(' ', '-')}-${sku}`,
        main_picture_url: 'display_picture.png',
      };
      products.push(Object.assign(product, addData));
      return products;
    });

    await elasticbulk.import(products, {
      index,
      host: 'http://localhost:9200',
    });
  } catch (error) {
    logger.error('error in bulkAdd Product:', error.message);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
}

export async function deleteProductDetails(productDetails) {
  try {
    const { slug } = productDetails;
    const id = productDetails._id;

    if (slug) {
      const body = { query: { match: { 'slug.keyword': slug } } };
      esclient.deleteByQuery({ index: 'buyer', body });
      esclient.delete({ index: 'seller', id });
    } else {
      esclient.delete({ index: 'seller', id });
    }

    return { success: 'Product deleted' };
  } catch (error) {
    logger.error('error in deleting Product:', error.message);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
}

export async function getProductDetails(slug) {
  const aggregate = [
    {
      $match: {
        slug,
        inactive: false,
        customer_ordered: false,
        sold: false,
        product_listed_on_dryp: true,
      },
    },
    {
      $group: {
        _id: '$slug',
        sizes: { $push: '$size' },
        prices: { $push: '$price' },
        product_ids: { $push: '$product_id' },
      },
    },
  ];
  const productSizesPrice = await Product.aggregate(aggregate);
  const query = {
    query: {
      match: {
        'slug.keyword': slug,
      },
    },
  };
  console.log('productSizesPrice=> ', productSizesPrice);
  const product = await esclient.search({ index: 'seller', body: query });
  const soldPrice = await Product.aggregate([
    { $match: { slug, customer_ordered: true } },
    {
      $group: {
        _id: { slug: '$slug', size: '$size' },
        price: {
          $min: '$price',
        },
      },
    },
  ]);
  console.log('soldPrice=> ', soldPrice);
  return product.hits.hits[0]._source;
}
export async function getProductDetailsById(productId) {
  const product = await getOne({ product_id: productId });
  if (product) {
    product.seller_email = null;
  }
  return product;
}

export async function getProductCollection() {
  const query = {
    size: 50,
    query: {
      match_all: {},
    },
  };
  const product = await esclient.search({ index: 'buyer', body: query });
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
    size: 8,
    query: {
      match: { brand_name: brand },
    },
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
export async function getStoreFront(filter) {
  const options = {};
  const products = await getProductList(filter, options);
  const productList = [];
  products.map(async (product) => {
    product.price = await getOriginalPrice(product.price);
    productList.push(product);
    return productList;
  });

  return productList;
}
export async function makeStoreFrontInactive(filter, options) {
  const products = await updateProduct(filter, { inactive: true }, options);
  if (products.product_listed_on_dryp) {
    await getObjectByProductId(filter.product_id);
  }
  return products;
}
export async function getSoldProducts(filter) {
  const products = await getProductList(filter);
  const soldProducts = [];
  products.map(async (product) => {
    const bid = await Bids.findOne({ accepted: true, seller: filter.seller_email, slug: product.slug, size: product.size });
    if (bid) {
      product.price = getOriginalPrice(bid.price, true);
    } else {
      product.price = getOriginalPrice(product.price);
    }
    soldProducts.push(product);
  });
  return soldProducts;
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
    // todo:  update buyer index, pending due to not get the logic used in forloop
    return product;
  } catch (error) {
    logger.error('error in updateBuyerIndexProducts:', error.message);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
}
export async function updateSellerAlgolia(productDetails) {
  try {
    const objectID = productDetails._id;
    const productDetail = productDetails;
    delete productDetail._id;
    await esclient.update({ index: 'seller', id: objectID, body: { doc: productDetail } });
    return { message: 'successfully seller algolia updated' };
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

export async function getProducts(body) {
  const products = await esclient.search({ index: 'buyer', body });
  return products;
}

export async function productFilter(body) {
  let size = 12;
  // const sortType = 'release_year';
  let sortOrder = 'asc';
  const match = {
    inactive: false,
    customer_ordered: false,
    sold: false,
    product_listed_on_dryp: true,
  };
  const filterCriteria = body.match;

  if (body.size) {
    size = body.size;
  }
  if (body.sort_by) {
    // todo: sortType is not used in ahead code
    // sortType = body.sort_by.type;
    sortOrder = body.sort_by.order;
  }
  if (Object.hasOwn(filterCriteria, 'product_type') && filterCriteria.product_type) {
    match.product_type = filterCriteria.product_type;
  }
  if (Object.hasOwn(filterCriteria, 'colors') && filterCriteria.colors) {
    match.colors = { $in: filterCriteria.colors };
  }
  if (Object.hasOwn(filterCriteria, 'brands') && filterCriteria.brands) {
    match.brand_name = { $in: filterCriteria.brands };
  }
  if (Object.hasOwn(filterCriteria, 'genders') && filterCriteria.genders) {
    match.gender = { $in: filterCriteria.genders.map((gender) => gender.toLowerCase()) };
  }
  if (Object.hasOwn(filterCriteria, 'sizes') && filterCriteria.sizes) {
    match.size = { $in: filterCriteria.sizes };
  }
  if (Object.hasOwn(filterCriteria, 'prices') && filterCriteria.prices) {
    match.price = { $gt: filterCriteria.prices.min, $lt: filterCriteria.prices.max };
  }
  if (Object.hasOwn(filterCriteria, 'release_year') && filterCriteria.release_year) {
    match.release_year = filterCriteria.release_year;
  }
  if (Object.hasOwn(filterCriteria, 'silhouette') && filterCriteria.silhouette) {
    match.silhouette = { $regex: filterCriteria.silhouette, $options: 'i' };
  }
  if (Object.hasOwn(filterCriteria, 'search_query') && filterCriteria.search_query) {
    match.$or = [
      {
        name: {
          $regex: filterCriteria.search_query,
          $options: 'i',
        },
      },
      {
        brand_name: {
          $regex: filterCriteria.search_query,
          $options: 'i',
        },
      },
      {
        silhouette: {
          $regex: filterCriteria.search_query,
          $options: 'i',
        },
      },
    ];
  }
  if (Object.hasOwn(filterCriteria, 'on_sale') && filterCriteria.on_sale) {
    match.on_sale = true;
  }
  const aggregate = [
    {
      $match: match,
    },
  ];
  aggregate.push({
    $group: {
      slug: {
        $first: '$slug',
      },
      _id: '$slug',
      product_type: {
        $first: '$product_type',
      },
      gender: {
        $first: '$gender',
      },
      price: {
        $min: '$price',
      },
      name: {
        $first: '$name',
      },
      sku: {
        $first: '$sku',
      },
      main_picture_url: {
        $first: '$main_picture_url',
      },
      product_id: {
        $first: '$product_id',
      },
      seller_email: {
        $first: '$seller_email',
      },
      size: {
        $first: '$size',
      },
      image_list: {
        $first: '$image_list',
      },
      silhouette: {
        $first: '$silhouette',
      },
      brand_name: {
        $first: '$brand_name',
      },
      product_listed_on_dryp: {
        $first: '$product_listed_on_dryp',
      },
      customer_ordered: {
        $first: '$customer_ordered',
      },
      product_received_on_dryp: {
        $first: '$product_received_on_dryp',
      },
      authenticity_check: {
        $first: '$authenticity_check',
      },
      product_shipped_to_customer: {
        $first: '$product_shipped_to_customer',
      },
      product_delivered: {
        $first: '$product_delivered',
      },
      reject_product: {
        $first: '$reject_product',
      },
      sold: {
        $first: '$sold',
      },
      inactive: {
        $first: '$inactive',
      },
      story_html: {
        $first: '$story_html',
      },
      release_year: {
        $first: '$release_year',
      },
      details: {
        $first: '$details',
      },
      color: {
        $first: '$color',
      },
      popular_rating: { $sum: 1 },
    },
  });
  let value;
  if (sortOrder === 'asc') {
    value = 1;
  } else {
    value = 0;
  }
  aggregate.push({ $sort: { sort_type: value } });
  try {
    const products = await Product.aggregate(aggregate);
    if (products.length) {
      return { data: { total: products.length, products: products[body.from + size] } };
    }
    return { message: 'no data available' };
  } catch (e) {
    logger.error('error in productFilter:', e.message);
  }
}
export async function getFilters(body) {
  // const order = await Transaction.find(filter);
  // return order;
  Object.assign(body, { size: 0 });
  const products = await esclient.search({ index: 'buyer', body });
  return products.aggregations;
}
export async function getQueryResults(query) {
  const results = {};
  ['Sneakers', 'Streetwear'].map(async (product) => {
    const body = {
      query: {
        bool: {
          must: [
            { term: { 'product_type.keyword': product } },
            {
              multi_match: {
                query,
                fields: ['name', 'brand_name', 'nickname', 'sku', 'silhouette', 'color'],
                type: 'phrase_prefix',
                operator: 'or',
              },
            },
          ],
        },
      },
    };
    try {
      const products = await esclient.search({ index: 'buyer', body });
      results.product = products.hits.total.value;
    } catch (e) {
      logger.error('error in getQueryResults: ', e.message);
      return { message: e.message };
    }
  });
  return results;
}

export async function getSearch(index, queryString, size) {
  const query = {
    query: {
      bool: {
        must: [
          {
            bool: {
              must: [
                {
                  bool: {
                    should: [
                      {
                        multi_match: {
                          query: queryString,
                          fields: ['name', 'brand_name', 'nickname', 'sku'],
                          type: 'best_fields',
                          operator: 'or',
                          fuzziness: 0,
                        },
                      },
                      {
                        multi_match: {
                          query: queryString,
                          fields: ['name', 'brand_name', 'nickname', 'sku'],
                          type: 'phrase',
                          operator: 'or',
                        },
                      },
                      {
                        multi_match: {
                          query: queryString,
                          fields: ['name', 'brand_name', 'nickname', 'sku'],
                          type: 'phrase_prefix',
                          operator: 'or',
                        },
                      },
                    ],
                    minimum_should_match: '1',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    size,
  };
  try {
    const products = await esclient.search({ index, body: query });
    return products;
  } catch (e) {
    logger.error('error in getSearch: ', e.message);
    return { error: e.message };
  }

  // return order;
}
export async function getOrders(filter) {
  const order = await Transaction.find(filter);
  return order;
}
