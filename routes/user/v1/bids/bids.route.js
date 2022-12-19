import express from 'express';
import { bidsController } from 'controllers/user';
import { bidsValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createBids
   * */
  .post(auth('user'), validate(bidsValidation.createBids), bidsController.create)
  /**
   * getBids
   * */
  .get(auth('user'), validate(bidsValidation.getBids), bidsController.list);
router
  .route('/paginated')
  /**
   * getBidsPaginated
   * */
  .get(auth('user'), validate(bidsValidation.paginatedBids), bidsController.paginate);
router
  .route('/:bidsId')
  /**
   * updateBids
   * */
  .put(auth('user'), validate(bidsValidation.updateBids), bidsController.update)
  /**
   * delete$BidsById
   * */
  .delete(auth('user'), validate(bidsValidation.deleteBidsById), bidsController.remove)
  /**
   * getBidsById
   * */
  .get(auth('user'), validate(bidsValidation.getBidsById), bidsController.get);
export default router;
