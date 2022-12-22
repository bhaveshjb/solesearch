import express from 'express';
import { productController } from 'controllers/user';
import { productValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProduct
   * */
  .post(auth('user'), validate(productValidation.createProduct), productController.create)
  /**
   * getProduct
   * */
  .get(auth('user'), validate(productValidation.getProduct), productController.list);
router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(auth('user'), validate(productValidation.paginatedProduct), productController.paginate);
// router
//   .route('/:productId')
//   /**
//    * updateProduct
//    * */
//   .put(auth('user'), validate(productValidation.updateProduct), productController.update)
//   /**
//    * delete$ProductById
//    * */
//   .delete(auth('user'), validate(productValidation.deleteProductById), productController.remove)
//   /**
//    * getProductById
//    * */
//   .get(auth('user'), validate(productValidation.getProductById), productController.get);
router
  .route('/sell-product')
  /**
   * sellProduct
   * */
  .post(auth('user'), validate(productValidation.sellProduct), productController.sellProduct);
router
  .route('/store-front')
  /**
   * store-front
   * */
  .get(auth('user'), productController.storeFront)
  /**
   * store-front inactive
   * */
  .delete(auth('user'), validate(productValidation.storeFrontInactive), productController.storeFrontInactive);
router
  .route('/sold-product')
  /**
   * sold-product
   * */
  .get(auth('user'), productController.soldProduct);
router
  .route('/not-found-form')
  /**
   * not-found-form
   * */
  .post(auth('user'), validate(productValidation.notFoundForm), productController.notFoundForm);
router
  .route('/Orders')
  /**
   * Orders
   * */
  .get(auth('user'), productController.orders);
export default router;
