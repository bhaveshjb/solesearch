import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Bids } from 'models';
import { logger } from '../config/logger';

export async function getBidsById(id, options) {
  const bids = await Bids.findById(id, options);
  return bids;
}

export async function getOne(query, options) {
  const bids = await Bids.findOne(query, options);
  return bids;
}

export async function getBidsList(filter, options) {
  const bids = await Bids.find(filter, options);
  return bids;
}

export async function getBidsListWithPagination(filter, options) {
  const bids = await Bids.paginate(filter, options);
  return bids;
}

export async function createBids(body) {
  try {
    const bids = Bids.create(body);
    return bids;
  } catch (error) {
    logger.error('error in creating Bids:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateBids(filter, body, options) {
  try {
    const bids = Bids.findOneAndUpdate(filter, body, options);
    return bids;
  } catch (error) {
    logger.error('error in creating Bids:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateManyBids(filter, body, options) {
  try {
    const bids = Bids.updateMany(filter, body, options);
    return bids;
  } catch (error) {
    logger.error('error in creating Bids:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeBids(filter) {
  const bids = await Bids.findOneAndRemove(filter);
  return bids;
}

export async function removeManyBids(filter) {
  const bids = await Bids.deleteMany(filter);
  return bids;
}

export async function getTrendingBids() {
  const aggregateQuery = [
    { $match: { active: true } },
    {
      $group: { _id: { slug: '$slug', name: '$name' }, count: { $sum: 1 } },
    },
  ];
  const bids = await Bids.aggregate(aggregateQuery);

  return bids;
}

export async function getSellerAcceptedBids(seller) {
  try {
    const aggregate = [
      {
        $match: {
          seller,
          accepted: true,
        },
      },
      { $group: { _id: { slug: '$slug', size: '$size' } } },
    ];

    const result = await Bids.aggregate(aggregate);
    const acceptedBids = new Set();
    result.forEach((res) => acceptedBids.add([res._id.slug, res._id.size]));
    return acceptedBids;
  } catch (err) {
    console.log(err);
  }
}
