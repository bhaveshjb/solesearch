import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { User } from 'models';
import crypto from 'crypto';
import { logger } from '../config/logger';

export async function getUserById(id, options) {
  const user = await User.findById(id, options);
  return user;
}

export async function getOne(query, options) {
  const user = await User.findOne(query, options);
  return user;
}

export async function getUserList(filter, options) {
  const user = await User.find(filter, options);
  return user;
}

export async function getUserListWithPagination(filter, options) {
  const user = await User.paginate(filter, options);
  return user;
}

export async function createUser(body) {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const flags = { isRegistered: true, isPassword: true };
  Object.assign(body, flags);
  const user = await User.create(body);
  return user;
}
export async function updateUser(filter, body, options) {
  const userData = await getOne(filter);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const user = await User.findOneAndUpdate(filter, body, options);
  return user;
}
async function generateUniqueId() {
  const dateTime = Date.now();
  const hash = crypto.createHash('ripemd160').update(`${dateTime}`).digest('hex');
  return hash.toString().slice(0, 19);
}
export async function addAddressService(filter, body, options) {
  const uniqueId = await generateUniqueId();
  Object.assign(body, { unique_id: uniqueId });
  const user = await User.findOneAndUpdate(filter, { $push: { address: body } }, options);
  return user.address[user.address.length - 1];
}

export async function getVerifyUser(filter) {
  await User.findOneAndUpdate(filter, { isVerified: true });
  return true;
}
export async function editAddressService(filter, body) {
  const status = await User.updateOne(
    { email: filter.email, 'address.unique_id': body.unique_id },
    {
      $set: {
        'address.$': body,
      },
    }
  );
  if (status.n && status.nModified) {
    return { message: 'Address has been updated', error: false };
  }
  return { message: 'Enter valid unique_id for address', error: true };
}
export async function getAddressService(filter) {
  const user = await User.findOne(filter);
  return user.address;
}
export async function deleteAddressService(filter, uniqueId) {
  const status = await User.updateOne(filter, { $pull: { address: { unique_id: uniqueId } } });
  if (status.n && status.nModified) {
    return { message: 'Address has been deleted', error: false };
  }
  return { message: 'Enter valid unique_id for address', error: true };
}

export async function addDefaultAddressService(filter, uniqueId, options) {
  const user = await User.findOneAndUpdate(filter, { default_address: uniqueId }, options);
  return user;
}
export async function getIndividualAddress(filter, uniqueId) {
  try {
    const user = await User.findOne({ address: { $elemMatch: { unique_id: uniqueId } } });
    return user.address;
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'address not available');
  }
}

export async function getDefaultAddressService(filter) {
  const user = await User.findOne(filter);
  if (!user.default_address) {
    logger.info('No default address found');
    return 'No default address found';
  }
  return user.default_address;
}

export async function updateManyUser(filter, body, options) {
  const user = await User.updateMany(filter, body, options);
  return user;
}

export async function removeUser(filter) {
  const user = await User.findOneAndRemove(filter);
  return user;
}

export async function removeManyUser(filter) {
  const user = await User.deleteMany(filter);
  return user;
}
export async function markWishListed(body, userData, options) {
  if (body.wishListAction) {
    await User.updateOne({ email: userData.email }, { $push: { wish_list: body.name } }, options);
  } else {
    await User.updateOne({ email: userData.email }, { $pull: { wish_list: body.name } }, options);
  }
  return true;
}
export async function getWishlist(filter) {
  const user = await User.findOne(filter);
  // console.log()
  return user.wish_list;
}
