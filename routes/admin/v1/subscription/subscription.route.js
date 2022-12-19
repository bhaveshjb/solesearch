import express from 'express';
import { subscriptionController } from 'controllers/admin';
import { subscriptionValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createSubscription
   * */
  .post(auth('admin'), validate(subscriptionValidation.createSubscription), subscriptionController.create)
  /**
   * getSubscription
   * */
  .get(auth('admin'), validate(subscriptionValidation.getSubscription), subscriptionController.list);
router
  .route('/paginated')
  /**
   * getSubscriptionPaginated
   * */
  .get(auth('admin'), validate(subscriptionValidation.paginatedSubscription), subscriptionController.paginate);
router
  .route('/:subscriptionId')
  /**
   * updateSubscription
   * */
  .put(auth('admin'), validate(subscriptionValidation.updateSubscription), subscriptionController.update)
  /**
   * delete$SubscriptionById
   * */
  .delete(auth('admin'), validate(subscriptionValidation.deleteSubscriptionById), subscriptionController.remove)
  /**
   * getSubscriptionById
   * */
  .get(auth('admin'), validate(subscriptionValidation.getSubscriptionById), subscriptionController.get);
export default router;
