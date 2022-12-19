import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { AdminUsers } from 'models';
import { logger } from '../config/logger';

export async function getAdminUsersById(id, options) {
  const adminUsers = await AdminUsers.findById(id, options);
  return adminUsers;
}

export async function getOne(query, options) {
  const adminUsers = await AdminUsers.findOne(query, options);
  return adminUsers;
}

export async function getAdminUsersList(filter, options) {
  const adminUsers = await AdminUsers.find(filter, options);
  return adminUsers;
}

export async function getAdminUsersListWithPagination(filter, options) {
  const adminUsers = await AdminUsers.paginate(filter, options);
  return adminUsers;
}

export async function createAdminUsers(body) {
  try {
    const adminUsers = AdminUsers.create(body);
    return adminUsers;
  } catch (error) {
    logger.error('error in creating AdminUsers:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateAdminUsers(filter, body, options) {
  try {
    const adminUsers = AdminUsers.findOneAndUpdate(filter, body, options);
    return adminUsers;
  } catch (error) {
    logger.error('error in creating AdminUsers:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateManyAdminUsers(filter, body, options) {
  try {
    const adminUsers = AdminUsers.updateMany(filter, body, options);
    return adminUsers;
  } catch (error) {
    logger.error('error in creating AdminUsers:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeAdminUsers(filter) {
  const adminUsers = await AdminUsers.findOneAndRemove(filter);
  return adminUsers;
}

export async function removeManyAdminUsers(filter) {
  const adminUsers = await AdminUsers.deleteMany(filter);
  return adminUsers;
}
