import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const SubscriptionSchema = new mongoose.Schema(
  {
    // /**
    //  * created By
    //  * */
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    // /**
    //  * updated By
    //  * */
    // updatedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    /**
     * collections
     * */
    collections: {
      type: String,
    },
    /**
     * email
     * */
    email: {
      type: String,
      required: true,
      match: /.+@.+\..+/,
      unique: true,
    },
  },
  { collection: 'subscription' }
);
SubscriptionSchema.plugin(toJSON);
SubscriptionSchema.plugin(mongoosePaginateV2);
const SubscriptionModel = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
module.exports = SubscriptionModel;
