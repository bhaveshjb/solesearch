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
  const filter = { email: req.user.email };

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

export const addAddress = catchAsync(async (req, res) => {
  const { body } = req;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const options = { new: true };
  const address = await userService.addAddressService(filter, body, options);
  return res.send({ message: ' New address has been added', address });
});
export const editAddress = catchAsync(async (req, res) => {
  const { body } = req;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const options = { new: true };
  await userService.editAddressService(filter, body, options);
  return res.send({ message: 'Address has been updated' });
});
export const getAddress = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const userAddress = await userService.getAddressService(filter, options);
  return res.send({ results: userAddress });
});
export const deleteAddress = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const uniqueId = req.body.unique_id;
  await userService.deleteAddressService(filter, uniqueId);
  return res.send({ message: 'Address has been deleted' });
});

export const addIndividualAddress = catchAsync(async (req, res) => {
  const uniqueId = req.params.unique_id;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const userAddress = await userService.getIndividualAddress(filter, uniqueId);
  return res.send({ results: userAddress });
});

export const addDefaultAddress = catchAsync(async (req, res) => {
  const uniqueId = req.params.unique_id;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const options = { new: true };
  await userService.addDefaultAddressService(filter, uniqueId, options);
  return res.send({ message: 'Default Address has been added' });
});
export const getDefaultAddress = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const options = {};
  const defaultAddress = await userService.getDefaultAddressService(filter, options);
  return res.send({ unique_id: defaultAddress });
});

export const remove = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const user = await userService.removeUser(filter);
  return res.send({ results: user });
});
export const updateWishList = catchAsync(async (req, res) => {
  const { body } = req;
  const userData = req.user;
  const options = { new: true };
  await userService.markWishListed(body, userData, options);
  return res.send({ message: 'Wishlist updated' });
});
export const wishList = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const options = {};
  const userWishList = await userService.getWishlist(filter, options);
  return res.send({ results: userWishList });
});
