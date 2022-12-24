import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';
// import csvtojson from 'csvtojson';
import { getTrendingBids } from '../../services/bids.service';
import { Product } from '../../models';
import { createTransaction, getRecentlySoldOrders, verifyTransaction } from '../../services/transaction.service';
import { redisClient } from '../../utils/redis';
import { logger } from '../../config/logger';
import { updateProduct } from '../../services/product.service';
import { sendEmail } from '../../services/email.service';

const utf8 = require('utf8');

export const check = catchAsync(async (req, res) => {
  const status = await productService.productUpdate();
  return res.send({ message: status });
});
export const sneakersList = catchAsync(async (req, res) => {
  const filter = {};
  const status = await productService.getProductList(filter);
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
  return res.send({ results: product });
});

export const productDetailsById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductDetailsById(id);
  return res.send({ product });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductList(filter, options);
  return res.send({ results: product });
});

export const collection = catchAsync(async (req, res) => {
  const product = await productService.getProductCollection();
  return res.send({ results: product });
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
  const { body } = req;
  const oldSlug = body.slug;
  const slug = body.name.toLowerCase().replace(' ', '-');
  const sku = body.sku.toLowerCase().replace(' ', '-');
  body.slug = `${slug}-${sku}`;
  body.brand_name = titleCase(body.brand_name);

  await productService.updateBuyerIndexProducts(oldSlug, body);
  // todo: update images to cloudinary
  body.product_id = utf8.encode(`${body.name} ${new Date()}`); //
  console.log('body.product_id=> ', body.product_id);
  await productService.updateSellerAlgolia(body);
  return res.send({ results: 'done' });
});
export const panelDeleteProduct = catchAsync(async (req, res) => {
  const { body } = req;
  await productService.deleteProductDetails(body);
  return res.send({ results: 'done' });
});

export const addNewProduct = catchAsync(async (req, res) => {
  const { body } = req;
  const slug = body.name.toLowerCase().replace(' ', '-');
  const sku = body.sku.toLowerCase().replace(' ', '-');
  body.slug = `${slug}-${sku}`;
  body.brand_name = titleCase(body.brand_name);

  // add method  upload_to_cloudinary to add upload images in cloudinary
  await productService.createProduct(body);
  return res.send({ message: 'Product added successfully', error: false });
});
export const bulkAddNewProduct = catchAsync(async (req, res) => {
  console.log('req.file=> ', req.files);
  const { file } = req.file;
  // console.log('files=> ', files.file);
  // const usersArray = await csvtojson().fromFile(file.path);
  // console.log('usersArray=> ', usersArray);
  // await productService.readFileAndGetUsers(files.file);
  await productService.readFileAndGetUsers(file);
  return res.send({ message: 'Product added successfully', error: false });
});

export const selectedProduct = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getSelectedProduct(slug);
  return res.send({ results: product });
});

export const relatedProducts = catchAsync(async (req, res) => {
  const { brand } = req.params;
  const product = await productService.getRelatedProducts(brand);
  return res.send({ results: product });
});

export const sellProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const userData = req.user;
  const product = await productService.sellProductService(productData, userData);
  return res.send({ results: product });
});
export const storeFront = catchAsync(async (req, res) => {
  const filter = {
    seller_email: req.user.email,
    inactive: false,
    sold: false,
  };
  const product = await productService.getStoreFront(filter);
  return res.send({ results: product });
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
  const product = await productService.getSoldProducts(filter);
  return res.send({ results: product });
});
export const notFoundForm = catchAsync(async (req, res) => {
  const { body } = req;
  const brandName = body.brand_name;
  const { size, name, colourway } = body;
  const emailContentText = `Request from user ${req.user.email} for a product with details:\n1. Size: ${size}\n2. Brand name: ${brandName}\n3. Name: ${name}\n4. Colourway: ${colourway}`;
  const subject = 'Product request';
  const to = ' info@solesearchindia.com';
  await sendEmail({ to, subject, emailContentText });
  return res.send({ message: 'success' });
});

export const orders = catchAsync(async (req, res) => {
  const filter = {
    buyer: req.user.email,
    is_bid: false,
  };
  const order = await productService.getOrders(filter);
  return res.send({ orders: order });
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
  const productReviewList = await productService.listProductReview(user);
  return res.send({ results: productReviewList });
});
export const confirmSellProduct = catchAsync(async (req, res) => {
  const { id } = req.body;
  const productReviewList = await productService.sellConfirmation(id);
  return res.send({ results: productReviewList });
});
export const rejectSellProduct = catchAsync(async (req, res) => {
  const { id } = req.body;
  const productReviewList = await productService.sellDecline(id);
  return res.send({ results: productReviewList });
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
  return res.send({ products });
});
export const filters = catchAsync(async (req, res) => {
  const { body } = req;
  const products = await productService.getFilters(body);
  return res.send({ products });
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
  return res.send({ products });
});
