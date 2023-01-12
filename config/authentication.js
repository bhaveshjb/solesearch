const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

async function getIdentityCheck(context) {
  const Authorization = context.headers.authorization;
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'no user found!');
    }
    if (user.isVerified) {
      return { email: user.email, user };
    }
    return { message: 'Please verify your email-id', error: true };
  }
  throw new Error('Not authorized');
}

module.exports = {
  getIdentityCheck,
};
