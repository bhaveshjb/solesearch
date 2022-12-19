import { adminUsersService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { adminUsersId } = req.params;
  const filter = {
    _id: adminUsersId,
  };
  const options = {};
  const adminUsers = await adminUsersService.getOne(filter, options);
  return res.send({ results: adminUsers });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const adminUsers = await adminUsersService.getAdminUsersList(filter, options);
  return res.send({ results: adminUsers });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const adminUsers = await adminUsersService.getAdminUsersListWithPagination(filter, options);
  return res.send({ results: adminUsers });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const adminUsers = await adminUsersService.createAdminUsers(body);
  return res.send({ results: adminUsers });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { adminUsersId } = req.params;
  const filter = {
    _id: adminUsersId,
  };
  const options = { new: true };
  const adminUsers = await adminUsersService.updateAdminUsers(filter, body, options);
  return res.send({ results: adminUsers });
});

export const remove = catchAsync(async (req, res) => {
  const { adminUsersId } = req.params;
  const filter = {
    _id: adminUsersId,
  };
  const adminUsers = await adminUsersService.removeAdminUsers(filter);
  return res.send({ results: adminUsers });
});
