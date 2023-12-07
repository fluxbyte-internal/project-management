import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { settings } from "../config/settings.js";

// Signup with Google
const googleLogin = new GoogleStrategy(
  {
    clientID: settings.googleCredentials.clientId,
    clientSecret: settings.googleCredentials.clientSecret,
    callbackURL: settings.googleCredentials.callbackUrl,
  },
  async (token, tokenSecret, profile, done) => {
    console.log({
      token,
      tokenSecret,
      profile,
    });
    return done(null, profile);
  }
);

// Signup with Facebook
const facebookLogin = new FacebookStrategy(
  {
    clientID: settings.facebookCredentials.appId,
    clientSecret: settings.facebookCredentials.appSecret,
    callbackURL: settings.facebookCredentials.callbackUrl,
    profileFields: [
      "id",
      "email",
      "gender",
      "profileUrl",
      "displayName",
      "locale",
      "name",
      "timezone",
      "updated_time",
      "verified",
      "picture.type(large)",
    ],
  },
  function (accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
);

// Serialize user into the session
// passport.serializeUser((user, done) => {
//   return done(null, user);
// });

// // Deserialize user from the session
// passport.deserializeUser((user, done) => {
//   if (!user) return false;
//   return done(null, user);
// });

passport.use(googleLogin);
// passport.use(facebookLogin);
