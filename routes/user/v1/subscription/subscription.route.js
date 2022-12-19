import express from 'express';
import { subscriptionController } from 'controllers/user';
import { subscriptionValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createSubscription
   * */
  .post(auth('user'), validate(subscriptionValidation.createSubscription), subscriptionController.create)
  /**
   * getSubscription
   * */
  .get(auth('user'), validate(subscriptionValidation.getSubscription), subscriptionController.list);
router
  .route('/paginated')
  /**
   * getSubscriptionPaginated
   * */
  .get(auth('user'), validate(subscriptionValidation.paginatedSubscription), subscriptionController.paginate);
router
  .route('/:subscriptionId')
  /**
   * updateSubscription
   * */
  .put(auth('user'), validate(subscriptionValidation.updateSubscription), subscriptionController.update)
  /**
   * delete$SubscriptionById
   * */
  .delete(auth('user'), validate(subscriptionValidation.deleteSubscriptionById), subscriptionController.remove)
  /**
   * getSubscriptionById
   * */
  .get(auth('user'), validate(subscriptionValidation.getSubscriptionById), subscriptionController.get);
export default router;
