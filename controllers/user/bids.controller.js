import { bidsService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { bidsId } = req.params;
  const filter = {
    _id: bidsId,
  };
  const options = {};
  const bids = await bidsService.getOne(filter, options);
  return res.send({ results: bids });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const bids = await bidsService.getBidsList(filter, options);
  return res.send({ results: bids });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const bids = await bidsService.getBidsListWithPagination(filter, options);
  return res.send({ results: bids });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const bids = await bidsService.createBids(body);
  return res.send({ results: bids });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { bidsId } = req.params;
  const filter = {
    _id: bidsId,
  };
  const options = { new: true };
  const bids = await bidsService.updateBids(filter, body, options);
  return res.send({ results: bids });
});

export const remove = catchAsync(async (req, res) => {
  const { bidsId } = req.params;
  const filter = {
    _id: bidsId,
  };
  const bids = await bidsService.removeBids(filter);
  return res.send({ results: bids });
});
