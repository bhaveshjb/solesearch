import passport from 'passport';
import config from 'config/config';
import FacebookTokenStrategy from 'passport-facebook-token';
import { authService } from 'services';
/**
 * we are calling this function since we need to register this in the passport Service so that in auth route it can find the appropriate strategy
 * */
module.exports = (function () {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        fbGraphVersion: 'v3.0',
        passReqToCallback: true,
      },
      function (accessToken, refreshToken, profile, done) {
        authService
          .createSocialUser(accessToken, refreshToken, profile, 'facebook')
          .then((user) => done(null, user))
          .catch((err) => done(err, null));
      }
    )
  );
})();
