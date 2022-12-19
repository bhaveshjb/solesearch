import express from 'express';
import { transactionController } from 'controllers/user';
import { transactionValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createTransaction
   * */
  .post(auth('user'), validate(transactionValidation.createTransaction), transactionController.create)
  /**
   * getTransaction
   * */
  .get(auth('user'), validate(transactionValidation.getTransaction), transactionController.list);
router
  .route('/paginated')
  /**
   * getTransactionPaginated
   * */
  .get(auth('user'), validate(transactionValidation.paginatedTransaction), transactionController.paginate);
router
  .route('/:transactionId')
  /**
   * updateTransaction
   * */
  .put(auth('user'), validate(transactionValidation.updateTransaction), transactionController.update)
  /**
   * delete$TransactionById
   * */
  .delete(auth('user'), validate(transactionValidation.deleteTransactionById), transactionController.remove)
  /**
   * getTransactionById
   * */
  .get(auth('user'), validate(transactionValidation.getTransactionById), transactionController.get);
export default router;
