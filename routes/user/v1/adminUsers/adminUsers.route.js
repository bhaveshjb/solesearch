import express from 'express';
import { adminUsersController } from 'controllers/user';
import { adminUsersValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createAdminusers
   * */
  .post(auth('user'), validate(adminUsersValidation.createAdminUsers), adminUsersController.create)
  /**
   * getAdminusers
   * */
  .get(auth('user'), validate(adminUsersValidation.getAdminUsers), adminUsersController.list);
router
  .route('/paginated')
  /**
   * getAdminusersPaginated
   * */
  .get(auth('user'), validate(adminUsersValidation.paginatedAdminUsers), adminUsersController.paginate);
router
  .route('/:adminUsersId')
  /**
   * updateAdminusers
   * */
  .put(auth('user'), validate(adminUsersValidation.updateAdminUsers), adminUsersController.update)
  /**
   * delete$AdminusersById
   * */
  .delete(auth('user'), validate(adminUsersValidation.deleteAdminUsersById), adminUsersController.remove)
  /**
   * getAdminusersById
   * */
  .get(auth('user'), validate(adminUsersValidation.getAdminUsersById), adminUsersController.get);
export default router;
