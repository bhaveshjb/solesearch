import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { getTrendingBids } from '../../services/bids.service';
import { Product } from '../../models';
import { getRecentlySoldOrders } from '../../services/transaction.service';

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
  body.product_id = new Date();
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
