import express from 'express';
import { userController } from 'controllers/user';
import { userValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from '../../../../middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUser
   * */
  .post(validate(userValidation.createUser), userController.create)
  /**
   * getUser
   * */
  .get(auth('user'), validate(userValidation.getUser), userController.list);
// router
// .route('/paginated')
// /**
//  * getUserPaginated
//  * */
// .get(validate(userValidation.paginatedUser), userController.paginate);
// router
//   .route('/:userId')
//   /**
//    * updateUser
//    * */
//   .put(validate(userValidation.updateUser), userController.update)
//   /**
//    * delete$UserById
//    * */
//   .delete(validate(userValidation.deleteUserById), userController.remove)
//   /**
//    * getUserById
//    * */
//   .get(validate(userValidation.getUserById), userController.get);
router
  .route('/add-user-info')
  /**
   * add-user-info
   * */
  .post(auth('user'), validate(userValidation.addAddress), userController.addAddress)
  .put(auth('user'), validate(userValidation.editAddress), userController.editAddress)
  .get(auth('user'), userController.getAddress)
  .delete(auth('user'), validate(userValidation.deleteAddress), userController.deleteAddress);

router
  .route('/add-user-info/:unique_id')
  /**
   * add-user-info
   * */
  .get(auth('user'), validate(userValidation.addIndividualAddress), userController.addIndividualAddress);
router
  .route('/default-address')
  /**
   * getDefaultAddress
   * */
  .get(auth('user'), userController.getDefaultAddress);
router
  .route('/default-address/:unique_id')
  /**
   * addDefaultAddress
   * */
  .post(auth('user'), validate(userValidation.addDefaultAddress), userController.addDefaultAddress);
router
  .route('/wish-list')
  /**
   * wish-list
   * */
  .put(auth('user'), validate(userValidation.wishList), userController.updateWishList)
  .get(auth('user'), userController.wishList);
router
  .route('/customer-support')
  /**
   * customer-support
   * */
  .post(auth('user'), validate(userValidation.customerSupport), userController.customerSupport);

export default router;
