import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';
// import csvtojson from 'csvtojson';
import httpStatus from 'http-status';
import fs from 'fs';
import _ from 'lodash';
import { getTrendingBids } from '../../services/bids.service';
import { Product } from '../../models';
import { createTransaction, getRecentlySoldOrders, verifyTransaction } from '../../services/transaction.service';
import { redisClient } from '../../utils/redis';
import { logger } from '../../config/logger';
import { updateProduct } from '../../services/product.service';
import { sendEmail } from '../../services/email.service';
import ApiError from '../../utils/ApiError';
import uploadToCloudinary from '../../utils/cloudinary';
import generateProductId from '../../utils/generateProductId';

const csv = require('csvtojson');

export const check = catchAsync(async (req, res) => {
  const status = await productService.productUpdate();
  return res.send({ message: status, error: false, data: {} });
});
export const sneakersList = catchAsync(async (req, res) => {
  const { offset } = req.body;
  const status = await productService.sneakerList(offset);
  return res.send({ message: status });
});

export const get = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = {};
  const product = await productService.getOne(filter, options);
  return res.send({ results: product });
});
export const productDetail = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getProductDetails(slug);
  return res.send(product);
});

export const productDetailsById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductDetailsById(id);
  return res.send({ product, error: false });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductList(filter, options);
  return res.send({ results: product });
});

export const collection = catchAsync(async (req, res) => {
  const product = await productService.getProductCollection();
  return res.send({ products: product, error: false });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const product = await productService.getProductListWithPagination(filter, options);
  return res.send({ results: product });
});

function titleCase(st) {
  return st
    .toLowerCase()
    .split(' ')
    .reduce((s, c) => `${s}${c.charAt(0).toUpperCase() + c.slice(1)} `, '');
}

export const panelAddProduct = catchAsync(async (req, res) => {
  let { body } = req;
  const oldSlug = body.slug;
  const slug = body.name.toLowerCase().replace(' ', '-');
  const sku = body.sku.toLowerCase().replace(' ', '-');
  body.slug = `${slug}-${sku}`;
  body.brand_name = titleCase(body.brand_name);

  await productService.updateBuyerIndexProducts(oldSlug, body);
  const imageFiles = req.files;
  const imageList = [];
  let displayPicture;

  if (!imageList.length) {
    _.omit(body, body.image_list);
  }
  if (imageFiles) {
    if (imageFiles.length) {
      for (let i = 0; i < imageFiles.length; i += 1) {
        const fileContentType = imageFiles[i].mimetype.split('/');
        const fileType = fileContentType[1];
        // assign the name of the file based on its position in the list
        let name;
        if (i === 0) {
          name = `display_picture.${fileType}`;
          displayPicture = name;
        } else {
          name = `${i}.${fileType}`;
          imageList.push(name);
        }
        // save the file to the "temp_images" folder
        fs.rename(`${imageFiles[i].path}`, `temp_images/${name}`, function (err) {
          if (err) {
            logger.error(`error in file renaming: ${err}`);
          } else {
            // file renamed successfully
            logger.info('successfully file renamed');
          }
        });
      }
      body = await uploadToCloudinary(displayPicture, imageList, body);
      if (!body.error) {
        body = body.data;
        body.product_id = generateProductId(body);
        await productService.updateSellerAlgolia(body);
        return res.send({ message: 'Product updated successfully', error: false });
      }
      res.send({ message: 'error in uploading images', error: true });
    }
  }
  body.product_id = generateProductId(body);
  await productService.updateSellerAlgolia(body);
  return res.send({ message: 'Product updated successfully', error: false });
});

export const panelDeleteProduct = catchAsync(async (req, res) => {
  const { body } = req;
  await productService.deleteProductDetails(body);
  return res.send({ message: 'Product deleted', error: false });
});

export const addNewProduct = catchAsync(async (req, res) => {
  let { body } = req;
  const slug = body.name.toLowerCase().replace(' ', '-');
  const sku = body.sku.toLowerCase().replace(' ', '-');
  body.slug = `${slug}-${sku}`;
  body.brand_name = titleCase(body.brand_name);
  const imageFiles = req.files;
  const imageList = [];
  let displayPicture = '';
  if (imageFiles) {
    for (let i = 0; i < imageFiles.length; i += 1) {
      const fileContentType = imageFiles[i].mimetype.split('/');
      const fileType = fileContentType[1];
      // assign the name of the file based on its position in the list
      let name;
      if (i === 0) {
        name = `display_picture.${fileType}`;
        displayPicture = name;
      } else {
        name = `${i}.${fileType}`;
        imageList.push(name);
      }
      // save the file to the "temp_images" folder
      fs.rename(`${imageFiles[i].path}`, `temp_images/${name}`, function (err) {
        if (err) {
          logger.error(`error in file renaming: ${err}`);
        } else {
          // file renamed successfully
          logger.info('successfully file renamed');
        }
      });
    }
    body = await uploadToCloudinary(displayPicture, imageList, body);
    if (!body.error) {
      body = body.data;
      await productService.createProduct(body);
      return res.send({ message: 'Product added successfully', error: false });
    }
    res.send({ message: 'error in uploading images', error: true });
  }

  await productService.createProduct(body);
  return res.send({ message: 'Product added successfully', error: false });
});

export const bulkAddNewProduct = catchAsync(async (req, res) => {
  const rawData = req.files.file.data.toString();
  const productData = await csv({
    noheader: true,
    // headers: ['name', 'description', 'product_type', 'gender', 'brand_name', 'color'],
    output: 'csv',
  }).fromString(rawData);
  const headers = [
    'name',
    'description',
    'product_type',
    'gender',
    'release_year',
    'colourway',
    'sku',
    'nickname',
    'brand_name',
    'silhouette',
    'color',
  ];
  const requiredHeaders = ['name', 'description', 'product_type', 'gender', 'brand_name', 'color'];
  const fileHeaders = productData[0].map((v) => v.toLowerCase());

  fileHeaders.map((header) => {
    if (!headers.includes(header)) {
      throw new Error(`Csv file headers are incorrect , unexpected header ${header}.`);
    }
    return 0;
  });

  requiredHeaders.map((header) => {
    if (!fileHeaders.includes(header)) {
      throw new Error(`Csv file headers are incorrect , missing header ${header}`);
    }
    return 0;
  });

  delete productData[0];
  const results = [];
  productData.map((arr) => {
    const obj = {
      name: arr[0],
      story_html: arr[1],
      product_type: arr[2],
      gender: arr[3],
      brand_name: arr[4],
      color: arr[5],
    };
    results.push(obj);
    return results;
  });
  await productService.bulkAdd('seller', results);
  return res.send({ error: false, message: 'Products added successfully.' });
});

export const bulkSellProduct = catchAsync(async (req, res) => {
  const rawData = req.files.file.data.toString();
  const productData = await csv({
    noheader: true,
    // headers: ['name', 'description', 'product_type', 'gender', 'brand_name', 'color', 'price', 'size'],
    output: 'csv',
  }).fromString(rawData);
  const headers = [
    'name',
    'description',
    'product_type',
    'gender',
    'release_year',
    'colourway',
    'sku',
    'nickname',
    'brand_name',
    'silhouette',
    'color',
    'price',
    'size',
  ];
  const requiredHeaders = ['name', 'description', 'product_type', 'gender', 'brand_name', 'color', 'price', 'size'];
  const fileHeaders = productData[0].map((v) => v.toLowerCase());

  fileHeaders.map((header) => {
    if (!headers.includes(header)) {
      throw new Error(`Csv file headers are incorrect , unexpected header ${header}.`);
    }
    return 0;
  });

  requiredHeaders.map((header) => {
    if (!fileHeaders.includes(header)) {
      throw new Error(`Csv file headers are incorrect , missing header ${header}`);
    }
    return 0;
  });
  const results = [];
  delete productData[0];
  productData.map((arr) => {
    const obj = {
      name: arr[0],
      story_html: arr[1],
      product_type: arr[2],
      gender: arr[3],
      brand_name: arr[4],
      color: arr[5],
      price: arr[6],
      size: arr[7],
    };
    results.push(obj);
    return results;
  });
  await productService.bulkSell(req.user.email, results);
  return res.send({ error: false, message: 'Products added for review' });
});

export const bulkAddNewUsers = catchAsync(async (req, res) => {
  try {
    const rawData = req.files.file.data.toString();
    const userData = await csv({
      noheader: false,
      output: 'csv',
    }).fromString(rawData);
    logger.info(`userData : ${userData}`);
    return res.send({ result: '', error: false });
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, ` error from bulk add users : ${e.message}`);
  }
});

export const selectedProduct = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getSelectedProduct(slug);
  return res.send({ product, error: false });
});

export const relatedProducts = catchAsync(async (req, res) => {
  const { brand } = req.params;
  const products = await productService.getRelatedProducts(brand);
  return res.send({ products, error: false });
});

export const sellProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const userData = req.user;
  const status = await productService.sellProductService(productData, userData);
  return res.send({ message: status, error: false });
});
export const storeFront = catchAsync(async (req, res) => {
  const filter = {
    seller_email: req.user.email,
    inactive: false,
    sold: false,
  };
  const product = await productService.getStoreFront(filter);
  return res.send({ product, error: false });
});
export const storeFrontInactive = catchAsync(async (req, res) => {
  const productId = req.body.product_id;
  const filter = {
    product_id: productId,
  };
  const options = { new: true };
  const product = await productService.makeStoreFrontInactive(filter, options);
  return res.send({ results: product });
});
export const soldProduct = catchAsync(async (req, res) => {
  const filter = {
    seller_email: req.user.email,
    inactive: false,
    customer_ordered: true,
  };
  const products = await productService.getSoldProducts(filter);
  return res.send({ products, error: false });
});
export const notFoundForm = catchAsync(async (req, res) => {
  const { body } = req;
  const brandName = body.brand_name;
  const { size, name, colourway } = body;
  const emailContentText = `Request from user ${req.user.email} for a product with details:\n1. Size: ${size}\n2. Brand name: ${brandName}\n3. Name: ${name}\n4. Colourway: ${colourway}`;
  const subject = 'Product request';
  const to = ' info@solesearchindia.com';
  await sendEmail({ to, subject, emailContentText });
  return res.send({ message: 'success', error: false });
});

export const orders = catchAsync(async (req, res) => {
  const filter = {
    buyer: req.user.email,
    is_bid: false,
  };
  const order = await productService.getOrders(filter);
  return res.send({ orders: order, error: false });
});
const checkIfProductBlocked = async (productId) => {
  const checkProduct = await redisClient.get(productId);
  if (checkProduct) {
    return true;
  }
  return false;
};
const blockProduct = async (productId) => {
  await redisClient.set(productId, true, { ex: 180 });
};

export const makePayment = catchAsync(async (req, res) => {
  const { body } = req;
  if (!(await checkIfProductBlocked(body.product_id))) {
    body.buyer = req.user.email;
    await blockProduct(body.product_id);
    const order = await createTransaction(body);
    logger.info(`order generated: ${order.order_id}`);
    return res.send({ message: 'Transaction order id generated.', order_id: order.order_id });
  }
  return res.send({ message: 'Product Blocked', blocked: true });
});

export const productSold = async (productId) => {
  await updateProduct({ product_id: productId }, { customer_ordered: true });
  // todo:send_email_to_seller
  return { error: false };
};

export const verifyPayment = catchAsync(async (req, res) => {
  const { body } = req;
  const order = await verifyTransaction(body);
  if (!order.error) {
    const result = await productSold(order.product_id);
    if (!result.error) {
      return res.send({ message: 'Payment Verified.', error: false });
    }
  }
  return res.send({ message: 'Payment not Verified.', error: true });
});
export const productReview = catchAsync(async (req, res) => {
  const { user } = req;
  const reviewProductList = await productService.listProductReview(user);
  return res.send({ product: reviewProductList, error: false });
});
export const confirmSellProduct = catchAsync(async (req, res) => {
  const { id } = req.body;
  const status = await productService.sellConfirmation(id);
  return res.send({ message: status, error: false });
});
export const rejectSellProduct = catchAsync(async (req, res) => {
  const { id } = req.body;
  const product = await productService.sellDecline(id);
  return res.send({ product, error: false });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = { new: true };
  const product = await productService.updateProduct(filter, body, options);
  return res.send({ results: product });
});

export const remove = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const product = await productService.removeProduct(filter);
  return res.send({ results: product });
});
export const getTrendingProducts = catchAsync(async (req, res) => {
  const products = await getTrendingBids();
  const sneakers = [];
  const streetwear = [];
  products.map(async (prod) => {
    const result = await Product.aggregate([
      { $match: { slug: prod._id.slug, product_listed_on_dryp: true, inactive: false, customer_ordered: false } },
      {
        $group: {
          _id: { product_type: '$product_type' },
          price: {
            $min: '$price',
          },
        },
      },
    ]);
    if (result) {
      if (result[0]._id.product_type === 'Sneakers') {
        sneakers.push(prod._id.slug, prod._id.name, prod._id.price, prod.count);
      } else if (result[0]._id.product_type === 'Streetwear') {
        streetwear.push(prod._id.slug, prod._id.name, prod._id.price, prod.count);
      }
    }
  });
  return res.send({ sneakers, streetwear });
});
export const getRecentlySoldProducts = catchAsync(async (req, res) => {
  const products = await getRecentlySoldOrders();
  const sneakers = [];
  products.map(async (prod) => {
    const result = await Product.aggregate([
      {
        $match: {
          slug: prod.slug,
          product_listed_on_dryp: true,
          inactive: false,
          customer_ordered: false,
          product_type: 'Sneakers',
        },
      },
      {
        $group: {
          _id: { product_type: '$product_type' },
          price: {
            $min: '$price',
          },
        },
      },
    ]);
    if (result) {
      sneakers.push(prod.slug, prod.name, result[0].price);
    }
  });
  return res.send({ products: sneakers });
});
export const getOnSaleProducts = catchAsync(async (req, res) => {
  const products = await Product.aggregate([
    { $match: { product_listed_on_dryp: true, inactive: false, customer_ordered: false, product_type: 'Auction' } },
    {
      $group: {
        _id: { slug: '$slug', name: '$name' },
        count: { $sum: 1 },
        price: {
          $min: '$price',
        },
      },
    },
  ]);
  const result = [];
  products.map(async (prod) => {
    result.push(prod._id.slug, prod._id.name, prod.price, prod.count);
  });
  return res.send({ products: result });
});
export const productsWithFilters = catchAsync(async (req, res) => {
  const { body } = req;
  const products = await productService.getProducts(body);
  return res.send({ products });
});
export const productFilterByQuery = catchAsync(async (req, res) => {
  const { body } = req;
  const products = await productService.productFilter(body);
  return res.send({ data: products.data, error: products.error });
});
export const filters = catchAsync(async (req, res) => {
  const { body } = req;
  try {
    const products = await productService.getFilters(body);
    return res.send({ error: false, aggregations: products });
  } catch (e) {
    throw new Error(`error=> ${e}`);
  }
});
export const queryResults = catchAsync(async (req, res) => {
  const { query } = req.params;
  const products = await productService.getQueryResults(query);
  return res.send({ products });
});
export const search = catchAsync(async (req, res) => {
  const { index, size } = req.params;
  const queryString = req.params.query_string;
  const products = await productService.getSearch(index, queryString, size);
  return res.send({ products, error: false });
});
