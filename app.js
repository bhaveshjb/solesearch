import path from 'path';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import mongoosePaginate from 'mongoose-paginate-v2';
// import fileUpload from 'express-fileupload';
import passport from 'passport';
import jwtStrategy from 'config/passport';
import routes from 'routes';
import ApiError from 'utils/ApiError';
import { errorConverter, errorHandler } from 'middlewares/error';
import sendResponse from 'middlewares/sendResponse';
import config from 'config/config';
import { successHandler, errorHandler as morganErrorHandler } from 'config/morgan';
import schema from './graphql/root.schema';
// import ejs from 'ejs';
//  const upload = require('multer')({ dest: '/tmp' });');
const { graphqlHTTP } = require('express-graphql');
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
// app.use(fileUpload());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());

/**
 * to prevent malicious users to send an object containing a $ operator, or including a ., which could change the context of a database operation. we use mongoSanitize().
 * By default, $ and . characters are removed completely from user-supplied input from req.body, req.params, req.headers, req.query.
 * here we added option  allowDots: true , so it will only sanitize $ characters , but allow .(dot) character , so we can get the proper request including .(dot) to perform operations as we required.
 * for example:
 * {
 *     "query": {
 *         "match": {
 *             "product_type.keyword": "Accessories"
 *         }
 *     }
 * }
 * when we pass the above query then mongoSanitize() remove product_type.keyword is completely removed from the request and we get match:{}, so we added allowDots:true option so we can get proper match query.
 * */
app.use(mongoSanitize({ allowDots: true }));

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
app.use(
  '/admin-panel/api/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

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
