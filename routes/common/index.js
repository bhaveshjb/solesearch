import express from 'express';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { productController } from '../../controllers/admin';
import { authValidation, subscriptionValidation, userValidation } from '../../validations/user';
import { authController, subscriptionController, userController } from '../../controllers/user';
import { productValidation } from '../../validations/admin';

const multer = require('multer');

const upload = multer({ dest: 'temp_images/' });
const productRoute = require('./product/product.route');

const router = express.Router();

router.route('/check').post(auth(), productController.check);
router.route('/sneakers').post(auth(), productController.sneakersList);
router.post('/register', validate(authValidation.register), authController.register);
router.put('/user-update', auth(), validate(authValidation.updateUserInfo), authController.updateUserInfo);
router.post('/login', validate(authValidation.login), authController.login);
router.patch('/set-new-password', auth(), validate(authValidation.userSetPassword), authController.userSetPassword);
router.patch('/verifyUser', auth(), authController.verifyUser);
router.post('/logout', auth(), authController.logout);
// router.post(
//   '/send-verification-link',
//   validate(authValidation.userSendVerificationLink),
//   authController.userSendVerificationLink
// );
router.post(
  '/facebook-signup-login',
  validate(authValidation.faceBookLogin),
  passport.authenticate('facebook-token', { session: false }),
  authController.socialLogin
);
router
  .route('/wish-list')
  .patch(auth(), validate(userValidation.wishList), userController.updateWishList)
  .get(auth(), userController.wishList);

// Elastic search GET APIs from vue frontend
router.route('/collections').get(productController.collection);
router.route('/search/:index/:query_string/:size').get(validate(productValidation.search), productController.search);
router
  .route('/selected-product/:slug')
  .get(validate(productValidation.getSelectedProduct), productController.selectedProduct);
router
  .route('/related-products/:brand')
  .get(validate(productValidation.getRelatedProducts), productController.relatedProducts);
router
  .route('/products/filters')
  .post(validate(productValidation.productsWithFilters), productController.productsWithFilters);
router
  .route('/products/filters/new')
  .post(validate(productValidation.productFilterByQuery), productController.productFilterByQuery);
router.route('/filters').post(validate(productValidation.filters), productController.filters);
router.route('/query-results/:query').get(validate(productValidation.queryResults), productController.queryResults);

router
  .route('/panel-add-product')
  .post(upload.array('image', 5), validate(productValidation.panelAddProduct), productController.panelAddProduct);
router
  .route('/panel-delete-product')
  .post(validate(productValidation.panelDeleteProduct), productController.panelDeleteProduct);
router.route('/product-review').get(productController.productReview);
router.route('/confirm-review').patch(validate(productValidation.confirmSellProduct), productController.confirmSellProduct);
router.route('/reject-review').patch(validate(productValidation.rejectSellProduct), productController.rejectSellProduct);

router
  .route('/add-new-product')
  .post(upload.array('image', 5), validate(productValidation.addNewProduct), productController.addNewProduct);

router.route('/bulk/add-new-product').post(fileUpload(), productController.bulkAddNewProduct);
router.route('/bulk/add-new-users').post(fileUpload(), productController.bulkAddNewUsers);

// sell products
router.route('/sell-product').post(auth(), validate(productValidation.sellProduct), productController.sellProduct);
router.route('/bulk/sell-product').post(auth(), fileUpload(), productController.bulkSellProduct);
router
  .route('/store-front')
  .get(auth(), productController.storeFront)
  .delete(auth(), validate(productValidation.storeFrontInactive), productController.storeFrontInactive);
router.route('/sold-product').get(auth(), productController.soldProduct);
router.route('/not-found-form').post(auth(), validate(productValidation.notFoundForm), productController.notFoundForm);
router.route('/orders').get(auth(), productController.orders);

// Buy Product
router.route('/buy-product').post(auth(), validate(productValidation.makePayment), productController.makePayment);
router.route('/verify-payment').post(auth(), validate(productValidation.verifyPayment), productController.verifyPayment);

// Edit Profile
router
  .route('/add-user-info')
  .post(auth(), validate(userValidation.addAddress), userController.addAddress)
  .put(auth(), validate(userValidation.editAddress), userController.editAddress)
  .get(auth(), userController.getAddress)
  .delete(auth(), validate(userValidation.deleteAddress), userController.deleteAddress);
router
  .route('/add-user-info/:unique_id')
  .get(auth(), validate(userValidation.addIndividualAddress), userController.addIndividualAddress);
router.route('/default-address').get(auth(), userController.getDefaultAddress);
router
  .route('/default-address/:unique_id')
  .post(auth(), validate(userValidation.addDefaultAddress), userController.addDefaultAddress);

// Subscribe collectible
router.route('/subscribers').post(validate(subscriptionValidation.subscribe), subscriptionController.subscribe);

// Customer Support
router.route('/customer-support').post(auth(), validate(userValidation.customerSupport), userController.customerSupport);

// Product
router.use('/product', productRoute);
module.exports = router;
