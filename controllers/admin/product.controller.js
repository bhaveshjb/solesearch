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
export const productDetail = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getProductDetails(slug);
  return res.send({ results: product });
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
  return res.send({ results: 'done' });
});

export const addNewProduct = catchAsync(async (req, res) => {
  const { body } = req;
  const slug = body.name.toLowerCase().replace(' ', '-');
  const sku = body.sku.toLowerCase().replace(' ', '-');
  body.slug = `${slug}-${sku}`;
  body.brand_name = titleCase(body.brand_name);

  // add method  upload_to_cloudinary to add upload images in cloudinary
  const product = await productService.createProduct(body);
  return res.send({ results: product });
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
