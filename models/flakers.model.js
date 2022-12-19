import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const FlakersSchema = new mongoose.Schema(
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
    restricted_until: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+@.+\..+/,
      unique: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
FlakersSchema.plugin(toJSON);
FlakersSchema.plugin(mongoosePaginateV2);
const FlakersModel = mongoose.models.Flakers || mongoose.model('Flakers', FlakersSchema);
module.exports = FlakersModel;
