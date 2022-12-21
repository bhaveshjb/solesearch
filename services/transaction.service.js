import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Transaction } from 'models';
import { logger } from '../config/logger';

export async function getTransactionById(id, options) {
  const transaction = await Transaction.findById(id, options);
  return transaction;
}

export async function getOne(query, options) {
  const transaction = await Transaction.findOne(query, options);
  return transaction;
}

export async function getTransactionList(filter, options) {
  const transaction = await Transaction.find(filter, options);
  return transaction;
}

export async function getTransactionListWithPagination(filter, options) {
  const transaction = await Transaction.paginate(filter, options);
  return transaction;
}

export async function createTransaction(body) {
  try {
    const transaction = Transaction.create(body);
    return transaction;
  } catch (error) {
    logger.error('error in creating Transaction:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateTransaction(filter, body, options) {
  try {
    const transaction = Transaction.findOneAndUpdate(filter, body, options);
    return transaction;
  } catch (error) {
    logger.error('error in creating Transaction:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateManyTransaction(filter, body, options) {
  try {
    const transaction = Transaction.updateMany(filter, body, options);
    return transaction;
  } catch (error) {
    logger.error('error in creating Transaction:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeTransaction(filter) {
  const transaction = await Transaction.findOneAndRemove(filter);
  return transaction;
}

export async function removeManyTransaction(filter) {
  const transaction = await Transaction.deleteMany(filter);
  return transaction;
}
export async function getRecentlySoldOrders() {
  const aggregate = [
    {
      $match: { success: true },
    },
    {
      $sort: { ordered_at: -1 },
    },
    {
      $limit: 50,
    },
    {
      $project: { slug: 1, name: 1 },
    },
  ];
  const soldProducts = await Transaction.aggregate(aggregate);
  return soldProducts;
}
