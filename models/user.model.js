import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';
import enumModel from 'models/enum.model';

const bcrypt = require('bcryptjs');

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
  used: {
    type: Boolean,
  },
  codeType: {
    type: String,
    enum: Object.values(enumModel.EnumCodeTypeOfCode),
  },
});
// const OauthSchema = new mongoose.Schema({
//   id: {
//     type: String,
//   },
//   token: {
//     type: String,
//   },
// });
const AddressSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    match: /.+@.+\..+/,
  },
  phone_number: {
    type: String,
  },
  building_name: {
    type: String,
  },
  house_flat_number: {
    type: String,
  },
  street_name: {
    type: String,
  },
  landmark: {
    type: String,
  },
  city_village: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  zip: {
    type: String,
  },
  unique_id: {
    type: String,
  },
});
const UserSchema = new mongoose.Schema({
  /**
   * Email address of User
   * */
  email: {
    type: String,
    match: /.+@.+\..+/,
    unique: true,
  },
  /**
   * For email verification
   * */
  emailVerified: {
    type: Boolean,
    private: true,
  },
  /**
   * custom server authentication
   * */
  codes: {
    type: [CodeSchema],
  },
  /**
   * password for authentication
   * */
  password: {
    type: String,
    private: true,
  },
  /**
   * first_name of user
   * */
  first_name: {
    type: String,
  },
  /**
   * last_name of user
   * */
  last_name: {
    type: String,
  },
  wish_list: {
    type: [String],
  },
  phone: {
    type: String,
  },
  instagram: {
    type: String,
  },
  /**
   * shoe_size of user
   * */
  shoe_size: {
    type: String,
  },
  /**
   * isRegistered
   * */
  isRegistered: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  address: {
    type: [AddressSchema],
  },
  /**
   * default_address for user
   * */
  default_address: {
    type: String,
  },
});
UserSchema.plugin(toJSON);
UserSchema.plugin(mongoosePaginateV2);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the User to be excluded
 * @returns Promise with boolean value
 */
UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const User = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!User;
};
UserSchema.pre('save', async function (next) {
  const User = this;
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 8);
  }
  next();
});
/**
 * When user reset password or change password then it save in bcrypt format
 */
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate(); // {password: "..."}
  if (update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    this.setUpdate({
      $set: {
        password: passwordHash,
      },
    });
  }
  next();
});
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = UserModel;
