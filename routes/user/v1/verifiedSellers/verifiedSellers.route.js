import express from 'express';
import { verifiedSellersController } from 'controllers/user';
import { verifiedSellersValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createVerifiedsellers
   * */
  .post(auth('user'), validate(verifiedSellersValidation.createVerifiedSellers), verifiedSellersController.create)
  /**
   * getVerifiedsellers
   * */
  .get(auth('user'), validate(verifiedSellersValidation.getVerifiedSellers), verifiedSellersController.list);
router
  .route('/paginated')
  /**
   * getVerifiedsellersPaginated
   * */
  .get(auth('user'), validate(verifiedSellersValidation.paginatedVerifiedSellers), verifiedSellersController.paginate);
router
  .route('/:verifiedSellersId')
  /**
   * updateVerifiedsellers
   * */
  .put(auth('user'), validate(verifiedSellersValidation.updateVerifiedSellers), verifiedSellersController.update)
  /**
   * delete$VerifiedsellersById
   * */
  .delete(auth('user'), validate(verifiedSellersValidation.deleteVerifiedSellersById), verifiedSellersController.remove)
  /**
   * getVerifiedsellersById
   * */
  .get(auth('user'), validate(verifiedSellersValidation.getVerifiedSellersById), verifiedSellersController.get);
export default router;
