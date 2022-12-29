import path from 'path';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import mongoosePaginate from 'mongoose-paginate-v2';
import fileUpload from 'express-fileupload';
import passport from 'passport';
import jwtStrategy from 'config/passport';
import routes from 'routes';
import ApiError from 'utils/ApiError';
import { errorConverter, errorHandler } from 'middlewares/error';
import sendResponse from 'middlewares/sendResponse';
import config from 'config/config';
import { successHandler, errorHandler as morganErrorHandler } from 'config/morgan';

// import ejs from 'ejs';
//  const upload = require('multer')({ dest: '/tmp' });');

const { adminBro } = require('./utils/adminBro');
const { adminBroRoute } = require('./utils/adminBro');

mongoosePaginate.paginate.options = {
  customLabels: { docs: 'results', totalDocs: 'totalResults' },
};
const app = express();
if (config.env !== 'test') {
  app.use(successHandler);
  app.use(morganErrorHandler);
}

// set security HTTP headers
app.use(helmet());

app.use(adminBro.options.rootPath, adminBroRoute);
// app.use(bodyParser.json());
app.use(express.json());
app.use(fileUpload());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// set api response
app.use(sendResponse);
// enable cors
app.use(cors());
app.options('*', cors());
// app.use(upload.any());
app.use(express.static(path.join(__dirname, '../public')));
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/admin-panel', routes);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
export default app;
