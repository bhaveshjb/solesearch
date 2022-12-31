import Joi from 'joi';
import config from '../../config/config';

export const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

export const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
  }),
};

// Token-based Verification when user select forgotPassword
export const verifyCode = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().length(config.jwt.resetPasswordCodeSize).required(),
  }),
};

export const addTokensToUser = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
};

export const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().required(),
  }),
};

export const resetPasswordOtp = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
  }),
};

export const resetPasswordOtpVerify = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
  }),
};

// Token-based resetPassword validation
export const resetPasswordToken = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().length(config.jwt.resetPasswordCodeSize).required(),
  }),
};

export const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
  }),
};

export const sendVerifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const faceBookLogin = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
  }),
};
