import { verifiedSellersService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { verifiedSellersId } = req.params;
  const filter = {
    _id: verifiedSellersId,
  };
  const options = {};
  const verifiedSellers = await verifiedSellersService.getOne(filter, options);
  return res.send({ results: verifiedSellers });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const verifiedSellers = await verifiedSellersService.getVerifiedSellersList(filter, options);
  return res.send({ results: verifiedSellers });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const verifiedSellers = await verifiedSellersService.getVerifiedSellersListWithPagination(filter, options);
  return res.send({ results: verifiedSellers });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const verifiedSellers = await verifiedSellersService.createVerifiedSellers(body);
  return res.send({ results: verifiedSellers });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { verifiedSellersId } = req.params;
  const filter = {
    _id: verifiedSellersId,
  };
  const options = { new: true };
  const verifiedSellers = await verifiedSellersService.updateVerifiedSellers(filter, body, options);
  return res.send({ results: verifiedSellers });
});

export const remove = catchAsync(async (req, res) => {
  const { verifiedSellersId } = req.params;
  const filter = {
    _id: verifiedSellersId,
  };
  const verifiedSellers = await verifiedSellersService.removeVerifiedSellers(filter);
  return res.send({ results: verifiedSellers });
});
