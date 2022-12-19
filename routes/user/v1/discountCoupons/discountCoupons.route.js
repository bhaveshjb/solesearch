import express from 'express';
import { discountCouponsController } from 'controllers/user';
import { discountCouponsValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createDiscountcoupons
   * */
  .post(auth('user'), validate(discountCouponsValidation.createDiscountCoupons), discountCouponsController.create)
  /**
   * getDiscountcoupons
   * */
  .get(auth('user'), validate(discountCouponsValidation.getDiscountCoupons), discountCouponsController.list);
router
  .route('/paginated')
  /**
   * getDiscountcouponsPaginated
   * */
  .get(auth('user'), validate(discountCouponsValidation.paginatedDiscountCoupons), discountCouponsController.paginate);
router
  .route('/:discountCouponsId')
  /**
   * updateDiscountcoupons
   * */
  .put(auth('user'), validate(discountCouponsValidation.updateDiscountCoupons), discountCouponsController.update)
  /**
   * delete$DiscountcouponsById
   * */
  .delete(auth('user'), validate(discountCouponsValidation.deleteDiscountCouponsById), discountCouponsController.remove)
  /**
   * getDiscountcouponsById
   * */
  .get(auth('user'), validate(discountCouponsValidation.getDiscountCouponsById), discountCouponsController.get);
export default router;
