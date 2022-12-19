import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const VerifiedSellersSchema = new mongoose.Schema(
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
     * email
     * */
    email: {
      type: String,
      required: true,
      match: /.+@.+\..+/,
      unique: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
VerifiedSellersSchema.plugin(toJSON);
VerifiedSellersSchema.plugin(mongoosePaginateV2);
const VerifiedSellersModel = mongoose.models.VerifiedSellers || mongoose.model('VerifiedSellers', VerifiedSellersSchema);
module.exports = VerifiedSellersModel;
