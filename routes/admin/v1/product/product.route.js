import express from 'express';
import { productController } from 'controllers/admin';
import { productValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/panel-add-product')
  /**
   * addProduct to panel
   * */
  .post(auth(), validate(productValidation.panelAddProduct), productController.panelAddProduct);
router
  .route('/add-new-product')
  /**
   *addProduct
   * */
  .post(auth(), validate(productValidation.addNewProduct), productController.addNewProduct)
  /**
   * getProduct
   * */
  .get(auth('admin'), validate(productValidation.getProduct), productController.list);
router
  .route('/product/:slug')
  /**
   * get product details by slug
   * */
  .get(auth(), validate(productValidation.getProductDetail), productController.productDetail);
router
  .route('/collection')
  /**
   * get product collection
   * */
  .get(auth('admin'), productController.collection);
router
  .route('/selected-product/:slug')
  /**
   * get selected product
   * */
  .get(auth('admin'), validate(productValidation.getSelectedProduct), productController.selectedProduct);
router
  .route('/related-products/:brand')
  /**
   * get selected product
   * */
  .get(auth('admin'), validate(productValidation.getRelatedProducts), productController.relatedProducts);

router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(auth('admin'), validate(productValidation.paginatedProduct), productController.paginate);
// router
//   .route('/:productId')
//   /**
//    * updateProduct
//    * */
//   .put(auth('admin'), validate(productValidation.updateProduct), productController.update)
//   /**
//    * delete$ProductById
//    * */
//   .delete(auth('admin'), validate(productValidation.deleteProductById), productController.remove)
//   /**
//    * getProductById
//    * */
//   .get(auth('admin'), validate(productValidation.getProductById), productController.get);
router
  .route('/sell-product')
  /**
   * sellProduct
   * */
  .post(auth('admin'), validate(productValidation.sellProduct), productController.sellProduct);
router
  .route('/product-review')
  /**
   * product-review
   * */
  .get(auth('admin'), productController.productReview);
router
  .route('/confirm-review')
  /**
   * confirm-review
   * */
  .patch(auth('admin'), validate(productValidation.confirmSellProduct), productController.confirmSellProduct);
router
  .route('/reject-review')
  /**
   * reject-review
   * */
  .patch(auth('admin'), validate(productValidation.rejectSellProduct), productController.rejectSellProduct);
export default router;
