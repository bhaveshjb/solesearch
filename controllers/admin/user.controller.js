import { userService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const options = {};
  const user = await userService.getOne(filter, options);
  return res.send({ results: user });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const user = await userService.getUserList(filter, options);
  return res.send({ results: user });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const user = await userService.getUserListWithPagination(filter, options);
  return res.send({ results: user });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await userService.createUser(body);
  return res.send({ results: user });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const options = { new: true };
  const user = await userService.updateUser(filter, body, options);
  return res.send({ results: user });
});

export const remove = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const user = await userService.removeUser(filter);
  return res.send({ results: user });
});
