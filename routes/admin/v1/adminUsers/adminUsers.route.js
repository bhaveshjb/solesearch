import express from 'express';
import { adminUsersController } from 'controllers/admin';
import { adminUsersValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createAdminusers
   * */
  .post(auth('admin'), validate(adminUsersValidation.createAdminUsers), adminUsersController.create)
  /**
   * getAdminusers
   * */
  .get(auth('admin'), validate(adminUsersValidation.getAdminUsers), adminUsersController.list);
router
  .route('/paginated')
  /**
   * getAdminusersPaginated
   * */
  .get(auth('admin'), validate(adminUsersValidation.paginatedAdminUsers), adminUsersController.paginate);
router
  .route('/:adminUsersId')
  /**
   * updateAdminusers
   * */
  .put(auth('admin'), validate(adminUsersValidation.updateAdminUsers), adminUsersController.update)
  /**
   * delete$AdminusersById
   * */
  .delete(auth('admin'), validate(adminUsersValidation.deleteAdminUsersById), adminUsersController.remove)
  /**
   * getAdminusersById
   * */
  .get(auth('admin'), validate(adminUsersValidation.getAdminUsersById), adminUsersController.get);
export default router;
