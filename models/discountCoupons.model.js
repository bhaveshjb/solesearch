import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const DiscountCouponsSchema = new mongoose.Schema(
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
     * coupon
     * */
    coupon: {
      type: String,
      required: true,
      unique: true,
    },
    /**
     * discount
     * */
    discount: {
      type: Number,
      default: 1,
    },
    /**
     * count
     * */
    count: {
      type: Number,
      default: 1,
    },
    /**
     * active
     * */
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
DiscountCouponsSchema.plugin(toJSON);
DiscountCouponsSchema.plugin(mongoosePaginateV2);
const DiscountCouponsModel = mongoose.models.DiscountCoupons || mongoose.model('DiscountCoupons', DiscountCouponsSchema);
module.exports = DiscountCouponsModel;
