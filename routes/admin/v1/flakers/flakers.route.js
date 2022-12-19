import express from 'express';
import { flakersController } from 'controllers/admin';
import { flakersValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createFlakers
   * */
  .post(auth('admin'), validate(flakersValidation.createFlakers), flakersController.create)
  /**
   * getFlakers
   * */
  .get(auth('admin'), validate(flakersValidation.getFlakers), flakersController.list);
router
  .route('/paginated')
  /**
   * getFlakersPaginated
   * */
  .get(auth('admin'), validate(flakersValidation.paginatedFlakers), flakersController.paginate);
router
  .route('/:flakersId')
  /**
   * updateFlakers
   * */
  .put(auth('admin'), validate(flakersValidation.updateFlakers), flakersController.update)
  /**
   * delete$FlakersById
   * */
  .delete(auth('admin'), validate(flakersValidation.deleteFlakersById), flakersController.remove)
  /**
   * getFlakersById
   * */
  .get(auth('admin'), validate(flakersValidation.getFlakersById), flakersController.get);
export default router;
