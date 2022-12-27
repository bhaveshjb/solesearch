import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';

const bcrypt = require('bcryptjs');

const AdminUsersSchema = new mongoose.Schema(
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
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    authenticated: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
AdminUsersSchema.plugin(toJSON);
AdminUsersSchema.plugin(mongoosePaginateV2);
AdminUsersSchema.pre('save', async function (next) {
  const User = this;
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 8);
  }
  next();
});
const AdminUsersModel = mongoose.models.AdminUsers || mongoose.model('AdminUsers', AdminUsersSchema);
module.exports = AdminUsersModel;
