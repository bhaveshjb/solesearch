import express from 'express';
import auth from '../../../middlewares/auth';
import validate from '../../../middlewares/validate';
import { productValidation } from '../../../validations/admin';
import { productController } from '../../../controllers/admin';

const router = express.Router();
router.route('/id/:id').get(auth(), validate(productValidation.productDetailsById), productController.productDetailsById);
router.route('/trending').get(auth(), productController.getTrendingProducts);
router.route('/recently-sold').get(auth(), productController.getRecentlySoldProducts);
router.route('/on-sale').get(auth(), productController.getOnSaleProducts);
router.route('/:slug').get(auth(), validate(productValidation.getProductDetail), productController.productDetail);
module.exports = router;
