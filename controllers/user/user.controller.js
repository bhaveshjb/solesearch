import { userService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { sendEmail } from '../../services/email.service';

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
  return res.send({ message: ' New address has been added', address, error: false });
});
export const editAddress = catchAsync(async (req, res) => {
  const { body } = req;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const options = {};
  const status = await userService.editAddressService(filter, body, options);
  return res.send({ message: status.message, error: status.error });
});
export const getAddress = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const options = {};
  const userAddress = await userService.getAddressService(filter, options);
  return res.send({ address: userAddress, error: false });
});
export const deleteAddress = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const uniqueId = req.body.unique_id;
  const status = await userService.deleteAddressService(filter, uniqueId);
  return res.send({ message: status.message, error: status.error });
});

export const addIndividualAddress = catchAsync(async (req, res) => {
  const uniqueId = req.params.unique_id;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const userAddress = await userService.getIndividualAddress(filter, uniqueId);
  return res.send({ address: userAddress, error: false });
});

export const addDefaultAddress = catchAsync(async (req, res) => {
  const uniqueId = req.params.unique_id;
  const currentUser = req.user;
  const filter = {
    email: currentUser.email,
  };
  const options = { new: true };
  await userService.addDefaultAddressService(filter, uniqueId, options);
  return res.send({ message: 'Default Address has been added', error: false });
});
export const getDefaultAddress = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const options = {};
  const defaultAddress = await userService.getDefaultAddressService(filter, options);
  return res.send({ unique_id: defaultAddress, error: false });
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
  return res.send({ message: 'Wishlist updated', error: false });
});
export const wishList = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const options = {};
  const userWishList = await userService.getWishlist(filter, options);
  return res.send({ message: 'Successfully retrieved wishlist', wish_list: userWishList, error: false });
});
export const customerSupport = catchAsync(async (req, res) => {
  const { body } = req;
  const firstName = body.first_name;
  const phoneNumber = body.phone_number;
  const issueType = body.issue_type;
  const referenceNumber = body.reference_number;

  const { email, description } = body;
  const emailContentText = `1. First name: ${firstName} \n2. Email address: ${email}\n3. Phone number: ${phoneNumber}\n4. Issue Type: ${issueType}\n6.Reference Number: ${referenceNumber}\n7. Description: ${description}`;
  const subject = 'Customer Request';
  const acknowledgmentText =
    'Your request has been acknowledged and is currently being processed.Our customer agent will get back to you shortly.';
  const helpdesk = 'support@solesearchindia.zohodesk.in';
  await sendEmail({ helpdesk, subject, emailContentText, isHtml: false });
  await sendEmail({ email, subject, acknowledgmentText, isHtml: false });
  return res.send({ message: 'done' });
});
