import { discountCouponsService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { discountCouponsId } = req.params;
  const filter = {
    _id: discountCouponsId,
  };
  const options = {};
  const discountCoupons = await discountCouponsService.getOne(filter, options);
  return res.send({ results: discountCoupons });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const discountCoupons = await discountCouponsService.getDiscountCouponsList(filter, options);
  return res.send({ results: discountCoupons });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const discountCoupons = await discountCouponsService.getDiscountCouponsListWithPagination(filter, options);
  return res.send({ results: discountCoupons });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const discountCoupons = await discountCouponsService.createDiscountCoupons(body);
  return res.send({ results: discountCoupons });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { discountCouponsId } = req.params;
  const filter = {
    _id: discountCouponsId,
  };
  const options = { new: true };
  const discountCoupons = await discountCouponsService.updateDiscountCoupons(filter, body, options);
  return res.send({ results: discountCoupons });
});

export const remove = catchAsync(async (req, res) => {
  const { discountCouponsId } = req.params;
  const filter = {
    _id: discountCouponsId,
  };
  const discountCoupons = await discountCouponsService.removeDiscountCoupons(filter);
  return res.send({ results: discountCoupons });
});
