import express from 'express';
import { verifiedSellersController } from 'controllers/admin';
import { verifiedSellersValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createVerifiedsellers
   * */
  .post(auth('admin'), validate(verifiedSellersValidation.createVerifiedSellers), verifiedSellersController.create)
  /**
   * getVerifiedsellers
   * */
  .get(auth('admin'), validate(verifiedSellersValidation.getVerifiedSellers), verifiedSellersController.list);
router
  .route('/paginated')
  /**
   * getVerifiedsellersPaginated
   * */
  .get(auth('admin'), validate(verifiedSellersValidation.paginatedVerifiedSellers), verifiedSellersController.paginate);
router
  .route('/:verifiedSellersId')
  /**
   * updateVerifiedsellers
   * */
  .put(auth('admin'), validate(verifiedSellersValidation.updateVerifiedSellers), verifiedSellersController.update)
  /**
   * delete$VerifiedsellersById
   * */
  .delete(auth('admin'), validate(verifiedSellersValidation.deleteVerifiedSellersById), verifiedSellersController.remove)
  /**
   * getVerifiedsellersById
   * */
  .get(auth('admin'), validate(verifiedSellersValidation.getVerifiedSellersById), verifiedSellersController.get);
export default router;
