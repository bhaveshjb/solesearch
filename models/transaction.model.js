import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const TransactionSchema = new mongoose.Schema(
  {
    /**
     * created By
     * */
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
     * buyer
     * */
    buyer: {
      type: String,
    },
    /**
     * razorpay_order_id
     * */
    razorpay_order_id: {
      type: String,
      unique: true,
    },
    /**
     * success
     * */
    success: {
      type: Boolean,
      default: false,
    },
    /**
     * razorpay_order_id
     * */
    ordered_at: {
      type: Date,
      default: new Date(),
    },
    /**
     * is_bid
     * */
    isBid: {
      type: Boolean,
      default: false,
    },
    /**
     * size
     * */
    size: {
      type: String,
    },
    /**
     * gst
     * */
    gst: {
      type: String,
    },
    /**
     * discount
     * */
    discount: {
      type: String,
    },
    /**
     * slug
     * */
    slug: {
      type: String,
    },
    /**
     * name
     * */
    name: {
      type: String,
    },
    /**
     * price
     * */
    price: {
      type: Number,
    },
    /**
     * product_id
     * */
    product_id: {
      type: String,
    },
    /**
     * email of user
     * */
    email: {
      type: String,
    },
    /**
     * first_name
     * */
    first_name: {
      type: String,
    },
    /**
     * last_name
     * */
    last_name: {
      type: String,
    },
    /**
     * phone_number
     * */
    phone_number: {
      type: String,
    },
    /**
     * building_name
     * */
    building_name: {
      type: String,
    },
    /**
     * house_flat_number
     * */
    house_flat_number: {
      type: String,
    },
    /**
     * street_name
     * */
    street_name: {
      type: String,
    },
    /**
     * landmark
     * */
    landmark: {
      type: String,
    },
    /**
     * city_village
     * */
    city_village: {
      type: String,
    },
    /**
     * state
     * */
    state: {
      type: String,
    },
    /**
     * country
     * */
    country: {
      type: String,
    },
    /**
     * zip
     * */
    zip: {
      type: String,
    },
  },
  { collection: 'transaction' }
);
TransactionSchema.plugin(toJSON);
TransactionSchema.plugin(mongoosePaginateV2);
const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
module.exports = TransactionModel;
