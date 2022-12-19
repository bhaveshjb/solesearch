import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { DiscountCoupons } from 'models';
import { logger } from '../config/logger';

export async function getDiscountCouponsById(id, options) {
  const discountCoupons = await DiscountCoupons.findById(id, options);
  return discountCoupons;
}

export async function getOne(query, options) {
  const discountCoupons = await DiscountCoupons.findOne(query, options);
  return discountCoupons;
}

export async function getDiscountCouponsList(filter, options) {
  const discountCoupons = await DiscountCoupons.find(filter, options);
  return discountCoupons;
}

export async function getDiscountCouponsListWithPagination(filter, options) {
  const discountCoupons = await DiscountCoupons.paginate(filter, options);
  return discountCoupons;
}

export async function createDiscountCoupons(body) {
  try {
    const discountCoupons = DiscountCoupons.create(body);
    return discountCoupons;
  } catch (error) {
    logger.error('error in creating DiscountCoupons:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateDiscountCoupons(filter, body, options) {
  try {
    const discountCoupons = DiscountCoupons.findOneAndUpdate(filter, body, options);
    return discountCoupons;
  } catch (error) {
    logger.error('error in creating DiscountCoupons:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateManyDiscountCoupons(filter, body, options) {
  try {
    const discountCoupons = DiscountCoupons.updateMany(filter, body, options);
    return discountCoupons;
  } catch (error) {
    logger.error('error in creating DiscountCoupons:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeDiscountCoupons(filter) {
  const discountCoupons = await DiscountCoupons.findOneAndRemove(filter);
  return discountCoupons;
}

export async function removeManyDiscountCoupons(filter) {
  const discountCoupons = await DiscountCoupons.deleteMany(filter);
  return discountCoupons;
}
