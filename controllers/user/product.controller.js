import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';

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
