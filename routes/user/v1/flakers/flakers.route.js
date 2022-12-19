import express from 'express';
import { flakersController } from 'controllers/user';
import { flakersValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createFlakers
   * */
  .post(auth('user'), validate(flakersValidation.createFlakers), flakersController.create)
  /**
   * getFlakers
   * */
  .get(auth('user'), validate(flakersValidation.getFlakers), flakersController.list);
router
  .route('/paginated')
  /**
   * getFlakersPaginated
   * */
  .get(auth('user'), validate(flakersValidation.paginatedFlakers), flakersController.paginate);
router
  .route('/:flakersId')
  /**
   * updateFlakers
   * */
  .put(auth('user'), validate(flakersValidation.updateFlakers), flakersController.update)
  /**
   * delete$FlakersById
   * */
  .delete(auth('user'), validate(flakersValidation.deleteFlakersById), flakersController.remove)
  /**
   * getFlakersById
   * */
  .get(auth('user'), validate(flakersValidation.getFlakersById), flakersController.get);
export default router;
