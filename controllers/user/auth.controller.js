import httpStatus from 'http-status';
import { generateOtp } from 'utils/common';
import ApiError from 'utils/ApiError';
import { catchAsync } from 'utils/catchAsync';
import { authService, tokenService, userService, emailService } from 'services';
import { EnumTypeOfToken, EnumCodeTypeOfCode } from 'models/enum.model';

export const register = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await userService.createUser(body);
  const emailVerifyToken = await tokenService.generateVerifyEmailToken(user.email);
  emailService.sendEmailVerificationEmail(user, emailVerifyToken).then().catch();
  res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'Email has been sent to your registered email. Please check your email and verify it',
      user,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({
    message: `Logged in as ${email}`,
    access_token: tokens.access,
    refresh_token: tokens.refresh,
    user,
    error: false,
  });
});

export const userSetPassword = catchAsync(async (req, res) => {
  const status = await authService.setNewPassword(req.body.password, req.user);
  res
    .status(httpStatus.OK)
    .send({ message: 'Password has been reset successfully', access_token: status.token, user: status.user, error: false });
});

// if user's email is not verified then we call this function for reverification
export const sendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const emailVerifyToken = await tokenService.generateVerifyEmailToken(email);
  const user = await userService.getOne({ email });
  emailService.sendEmailVerificationEmail(user, emailVerifyToken).then().catch();
  res.send({
    success: true,
    message: 'Email has been sent to your registered email. Please check your email and verify it',
  });
});

/**
 * Token-based forgotPassword Verify Controller
 * @type {(request.query: token)}
 * @return (successMessage)
 */
export const verifyEmail = catchAsync(async (req, res) => {
  try {
    await authService.verifyEmail(req.query);
    res.send({ message: 'Your Email is Verified Successfully' });
  } catch (e) {
    res.send({ message: e.message });
  }
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(httpStatus.OK).send({ results: { success: true, message: 'Code has been sent' } });
});

/**
 * Token-based forgotPassword Controller
 * @type {(function(*, *, *): void)|*}
 */
export const forgotPasswordToken = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send({ success: true, message: 'Code has been sent' });
});

/**
 * Token-based forgotPassword Verify Controller
 * @type {(function(*, *, *): void)|*}
 */
export const verifyResetCode = catchAsync(async (req, res) => {
  req.body.type = EnumTypeOfToken.RESET_PASSWORD;
  await tokenService.verifyCode(req.body);
  res.status(httpStatus.OK).send({ success: true });
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { body } = req;
  const { otp, email } = body;
  await tokenService.verifyOtp(email, otp);
  res.status(httpStatus.OK).send({ results: { success: true } });
});

export const resetPasswordOtp = catchAsync(async (req, res) => {
  await authService.resetPasswordOtp(req.body);
  res.status(httpStatus.OK).send({ results: { success: true, message: 'Password has been reset successfully' } });
});

export const resetPasswordOtpVerify = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await tokenService.verifyResetOtpVerify(email, otp);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something is went wrong!');
  }
  res.status(httpStatus.OK).send({ results: { success: true } });
});

/**
 * Token-based resetPassword Controller
 * @type {(function(*, *, *): void)|*}
 */
export const resetPasswordToken = catchAsync(async (req, res) => {
  await authService.resetPasswordToken(req.body);
  res.status(httpStatus.OK).send({ success: true, message: 'Password has been reset successfully' });
});

export const userInfo = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  res.send({ results: { user } });
});

export const verifyUser = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const options = { new: true };
  const user = await userService.getVerifyUser(filter, options);
  res.send({ message: 'Your profile has been verified successfully', user, error: false });
});

/**
 * Update the userInfo when he is LoggedIn
 * @type {(function(*, *, *): void)|*}
 */
export const updateUserInfo = catchAsync(async (req, res) => {
  const filter = { email: req.user.email };
  const option = { new: true };
  const user = await userService.updateUser(filter, req.body, option);
  res.send({ message: 'User updated successfully', user, error: false });
});

export const sendVerifyOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this id!');
  }
  if (user.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'your email is already verified!');
  }
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000,
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });
  await user.save();
  await emailService.sendOtpVerificationEmail(user, otp).then().catch();
  res.send({
    results: {
      success: true,
      message: 'Email has been sent to your registered email. Please check your email and verify it',
    },
  });
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ results: { ...tokens } });
});

export const logout = catchAsync(async (req, res) => {
  await tokenService.invalidateToken(req.rawHeaders[1]);
  res.send({ message: 'Successfully logged out' });
});

export const socialLogin = catchAsync(async (req, res) => {
  const user = await authService.socialLogin(req.user);
  const token = await tokenService.generateAuthTokens(req.user);
  return res.json({ results: { user, token } });
});

// export const userSendVerificationLink = catchAsync(async (req, res) => {
//   // const user = await authService.socialLogin(req.user);
//   // const token = await tokenService.generateAuthTokens(req.user);
//   // return res.json({ results: { user, token } });
// });
