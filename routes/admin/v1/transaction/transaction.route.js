import express from 'express';
import { transactionController } from 'controllers/admin';
import { transactionValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createTransaction
   * */
  .post(auth('admin'), validate(transactionValidation.createTransaction), transactionController.create)
  /**
   * getTransaction
   * */
  .get(auth('admin'), validate(transactionValidation.getTransaction), transactionController.list);
router
  .route('/paginated')
  /**
   * getTransactionPaginated
   * */
  .get(auth('admin'), validate(transactionValidation.paginatedTransaction), transactionController.paginate);
router
  .route('/:transactionId')
  /**
   * updateTransaction
   * */
  .put(auth('admin'), validate(transactionValidation.updateTransaction), transactionController.update)
  /**
   * delete$TransactionById
   * */
  .delete(auth('admin'), validate(transactionValidation.deleteTransactionById), transactionController.remove)
  /**
   * getTransactionById
   * */
  .get(auth('admin'), validate(transactionValidation.getTransactionById), transactionController.get);
export default router;
