import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const BidsSchema = new mongoose.Schema(
  {
    /**
     * created By
     * */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * updated By
     * */
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * order_id
     * */
    order_id: {
      type: String,
      required: true,
      unique: true,
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
     * size
     * */
    size: {
      type: String,
      required: true,
    },
    /**
     * price
     * */
    price: {
      type: Number,
      required: true,
    },
    /**
     * buyer emailId
     * */
    buyer: {
      type: String,
      required: true,
      match: /.+@.+\..+/,
    },
    /**
     * active
     * */
    active: {
      type: Boolean,
      default: true,
    },
    /**
     * accepted
     * */
    accepted: {
      type: Boolean,
      default: false,
    },
    /**
     * seller_notified
     * */
    seller_notified: {
      type: Boolean,
      default: false,
    },
    /**
     * buyer_notified
     * */
    buyer_notified: {
      type: Boolean,
      default: false,
    },
    /**
     * expiry
     * */
    expiry: {
      type: Date,
      required: true,
    },
    /**
     * payment_deadline
     * */
    payment_deadline: {
      type: Date,
    },
    /**
     * seller emailId
     * */
    seller: {
      type: String,
      match: /.+@.+\..+/,
    },
    /**
     * completed
     * */
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
BidsSchema.plugin(toJSON);
BidsSchema.plugin(mongoosePaginateV2);
const BidsModel = mongoose.models.Bids || mongoose.model('Bids', BidsSchema);
module.exports = BidsModel;
