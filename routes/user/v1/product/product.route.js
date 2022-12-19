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
router
  .route('/:productId')
  /**
   * updateProduct
   * */
  .put(auth('user'), validate(productValidation.updateProduct), productController.update)
  /**
   * delete$ProductById
   * */
  .delete(auth('user'), validate(productValidation.deleteProductById), productController.remove)
  /**
   * getProductById
   * */
  .get(auth('user'), validate(productValidation.getProductById), productController.get);
export default router;
