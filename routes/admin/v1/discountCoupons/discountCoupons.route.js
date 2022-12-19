import express from 'express';
import { discountCouponsController } from 'controllers/admin';
import { discountCouponsValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createDiscountcoupons
   * */
  .post(auth('admin'), validate(discountCouponsValidation.createDiscountCoupons), discountCouponsController.create)
  /**
   * getDiscountcoupons
   * */
  .get(auth('admin'), validate(discountCouponsValidation.getDiscountCoupons), discountCouponsController.list);
router
  .route('/paginated')
  /**
   * getDiscountcouponsPaginated
   * */
  .get(auth('admin'), validate(discountCouponsValidation.paginatedDiscountCoupons), discountCouponsController.paginate);
router
  .route('/:discountCouponsId')
  /**
   * updateDiscountcoupons
   * */
  .put(auth('admin'), validate(discountCouponsValidation.updateDiscountCoupons), discountCouponsController.update)
  /**
   * delete$DiscountcouponsById
   * */
  .delete(auth('admin'), validate(discountCouponsValidation.deleteDiscountCouponsById), discountCouponsController.remove)
  /**
   * getDiscountcouponsById
   * */
  .get(auth('admin'), validate(discountCouponsValidation.getDiscountCouponsById), discountCouponsController.get);
export default router;
