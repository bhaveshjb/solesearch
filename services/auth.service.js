import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import { User, Token } from 'models';
import { userService, tokenService, emailService } from 'services';
import { EnumTypeOfToken, EnumCodeTypeOfCode } from 'models/enum.model';
import bcrypt from 'bcryptjs';
import { generateOtp } from 'utils/common';
import { generateAuthTokens } from './token.service';
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  if (!user.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please check your email and verify it to continue login in to app');
  }
  return user;
};

export const verifyEmail = async (verifyRequest) => {
  const { token } = verifyRequest;
  const verifyEmailTokenDoc = await tokenService.verifyToken(token, EnumTypeOfToken.VERIFY_EMAIL);
  const { user } = verifyEmailTokenDoc;
  await Token.deleteMany({ user, type: EnumTypeOfToken.VERIFY_EMAIL });
  const filter = {
    _id: user,
  };
  return userService.updateUser(filter, { isRegistered: true, isVerified: true });
};

/**
 * forgotPassword with Email
 * @param {string} email
 * @returns {Promise<User>}
 */
export const forgotPassword = async (email) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this email');
  }
  const otp = generateOtp();
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000,
    used: false,
    codeType: EnumCodeTypeOfCode.RESETPASSWORD,
  });
  await user.save();
  await emailService.sendResetPasswordEmail(email, otp);
  return user;
};

export const resetPasswordOtp = async (resetPasswordRequest) => {
  const { email, otp, password } = resetPasswordRequest;
  const user = await tokenService.verifyResetOtp(email, otp);
  const filter = {
    _id: user._id,
  };
  return userService.updateUser(filter, { password });
};

/**
 * Reset password Token-based Service
 * @returns {Promise}
 * @param resetPasswordRequest
 * @param {string} [resetPasswordRequest.password]
 * @param {string} [resetPasswordRequest.code]
 * @param {string} [resetPasswordRequest.email]
 */
export const resetPasswordToken = async (resetPasswordRequest) => {
  const { email, code, password } = resetPasswordRequest;
  const resetPasswordTokenDoc = await tokenService.verifyCode({
    email,
    type: EnumTypeOfToken.RESET_PASSWORD,
    code,
  });
  const { user } = resetPasswordTokenDoc;
  await Token.deleteMany({ user, type: EnumTypeOfToken.RESET_PASSWORD });
  const filter = {
    _id: user._id,
  };
  return userService.updateUser(filter, { password });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, EnumTypeOfToken.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * check whether user is being created from the method createSocialUser if not then throw the Error
 * @param user
 * @returns {Promise<*>}
 */
export const socialLogin = async (user) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid SingIn');
  }
  return user;
};

/**
 * Create the Social user like Facebook, google and Apple Login
 * @param accessToken
 * @param refreshToken
 * @param profile
 * @param provider
 * @returns {Promise<*>}
 */
export const createSocialUser = async (accessToken, refreshToken, profile, provider) => {
  const query = {};
  const userObj = {};
  /**
   * If provider is facebook then save the details of user in db.
   */
  if (provider === 'facebook') {
    query.$or = [{ 'facebookProvider.id': profile.id }, { email: profile.emails[0].value }];
    const userFullName = profile.displayName.split(' ');
    const [firstName, lastName] = userFullName;
    userObj.name = firstName;
    userObj.lastName = lastName || '';
    userObj.email = profile.emails[0].value;
    userObj.facebookProvider = {
      id: profile.id,
      token: accessToken,
    };
    userObj.isVerified = true;
  }
  userObj.password = Math.random().toString(36).slice(-10);
  return User.findOne(query).then(async (user) => {
    if (!user) {
      const newUser = new User(userObj);
      return newUser.save();
    }
    if (provider === 'facebook') {
      user.facebookProvider = userObj.facebookProvider; // eslint-disable-line no-param-reassign
    }
    return User.findOneAndUpdate({ _id: user._id }, user, {
      new: true,
      upsert: true,
    }).lean();
  });
};
export const setNewPassword = async (password, userInfo) => {
  const filter = {
    email: userInfo.email,
  };
  const options = { new: true };
  const user = await userService.updateUser(filter, { password, isVerified: true }, options);

  const token = await generateAuthTokens(userInfo);
  return { token: token.access.token, user };
};
