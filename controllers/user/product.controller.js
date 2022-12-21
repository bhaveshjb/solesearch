import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { sendEmail } from '../../services/email.service';

export const get = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = {};
  const product = await productService.getOne(filter, options);
  return res.send({ results: product });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductList(filter, options);
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

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const product = await productService.createProduct(body);
  return res.send({ results: product });
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
