import express from 'express';
import { bidsController } from 'controllers/admin';
import { bidsValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createBids
   * */
  .post(auth('admin'), validate(bidsValidation.createBids), bidsController.create)
  /**
   * getBids
   * */
  .get(auth('admin'), validate(bidsValidation.getBids), bidsController.list);
router
  .route('/paginated')
  /**
   * getBidsPaginated
   * */
  .get(auth('admin'), validate(bidsValidation.paginatedBids), bidsController.paginate);
router
  .route('/:bidsId')
  /**
   * updateBids
   * */
  .put(auth('admin'), validate(bidsValidation.updateBids), bidsController.update)
  /**
   * delete$BidsById
   * */
  .delete(auth('admin'), validate(bidsValidation.deleteBidsById), bidsController.remove)
  /**
   * getBidsById
   * */
  .get(auth('admin'), validate(bidsValidation.getBidsById), bidsController.get);
export default router;
