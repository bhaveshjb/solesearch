import { flakersService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { flakersId } = req.params;
  const filter = {
    _id: flakersId,
  };
  const options = {};
  const flakers = await flakersService.getOne(filter, options);
  return res.send({ results: flakers });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const flakers = await flakersService.getFlakersList(filter, options);
  return res.send({ results: flakers });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const flakers = await flakersService.getFlakersListWithPagination(filter, options);
  return res.send({ results: flakers });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const flakers = await flakersService.createFlakers(body);
  return res.send({ results: flakers });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { flakersId } = req.params;
  const filter = {
    _id: flakersId,
  };
  const options = { new: true };
  const flakers = await flakersService.updateFlakers(filter, body, options);
  return res.send({ results: flakers });
});

export const remove = catchAsync(async (req, res) => {
  const { flakersId } = req.params;
  const filter = {
    _id: flakersId,
  };
  const flakers = await flakersService.removeFlakers(filter);
  return res.send({ results: flakers });
});
