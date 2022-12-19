import { transactionService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const get = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const filter = {
    _id: transactionId,
  };
  const options = {};
  const transaction = await transactionService.getOne(filter, options);
  return res.send({ results: transaction });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const transaction = await transactionService.getTransactionList(filter, options);
  return res.send({ results: transaction });
});

export const paginate = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    ...req.query,
  };
  const transaction = await transactionService.getTransactionListWithPagination(filter, options);
  return res.send({ results: transaction });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const transaction = await transactionService.createTransaction(body);
  return res.send({ results: transaction });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { transactionId } = req.params;
  const filter = {
    _id: transactionId,
  };
  const options = { new: true };
  const transaction = await transactionService.updateTransaction(filter, body, options);
  return res.send({ results: transaction });
});

export const remove = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const filter = {
    _id: transactionId,
  };
  const transaction = await transactionService.removeTransaction(filter);
  return res.send({ results: transaction });
});
