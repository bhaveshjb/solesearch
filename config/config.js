import path from 'path';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../.env') });
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    SUPERUSER_USERNAME: Joi.string().required().description('Admin userName'),
    SUPERUSER_PASSWORD: Joi.string().required().description('Admin userName'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    FRONT_URL: Joi.string().description('frontend url for email service'),
    PARTY_USER_LIMIT: Joi.number().default(8),
    RESET_PASSWORD_CODE_SIZE: Joi.number().default(6),
    ELASTIC_SEARCH_URL: Joi.string(),
    FACEBOOK_CLIENT_ID: Joi.string().required().description('Facebook Client is required'),
    FACEBOOK_CLIENT_SECRET: Joi.string().required().description('facebook Client Secret is required'),
    CLOUDNIARY_CLOUD_NAME: Joi.string().description('cloud name of cloudniary that will store the images'),
    CLOUDNIARY_API_KEY: Joi.string().description('API key for cloudniary'),
    CLOUDNIARY_API_SECRET: Joi.string().description('API secret for cloudniary'),
  })
  .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
    verifyEmailExpirationMinutes: 180,
    resetPasswordCodeSize: envVars.RESET_PASSWORD_CODE_SIZE,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  front: {
    url: envVars.FRONT_URL,
  },
  notification: {
    ttl: 60 * 60 * 24,
  },
  party: {
    limit: envVars.PARTY_USER_LIMIT,
  },
  facebook: {
    clientID: envVars.FACEBOOK_CLIENT_ID,
    clientSecret: envVars.FACEBOOK_CLIENT_SECRET,
  },
  superUser: {
    username: envVars.SUPERUSER_USERNAME,
    password: envVars.SUPERUSER_PASSWORD,
  },
  es: {
    url: envVars.ELASTIC_SEARCH_URL,
  },
  cloudniary: {
    cloudName: envVars.CLOUDNIARY_CLOUD_NAME,
    apiKey: envVars.CLOUDNIARY_API_KEY,
    apiSecret: envVars.CLOUDNIARY_API_SECRET,
  },
};
