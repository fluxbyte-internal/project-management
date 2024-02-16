import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { settings } from "../config/settings.js";
import { getClientByTenantId } from "../config/db.js";
import { UserProviderTypeEnum, UserStatusEnum } from "@prisma/client";

const loginWithGoogle = new GoogleStrategy(
  {
    clientID: settings.googleCredentials.clientId,
    clientSecret: settings.googleCredentials.clientSecret,
    callbackURL: settings.googleCredentials.callbackUrl,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const prisma = await getClientByTenantId("root");
      const email =
        profile.emails && profile.emails[0] ? profile.emails[0].value : "";
      let user = await prisma.user.findUnique({
        where: { email, deletedAt: null },
      });
      if (user) {
        const findGoogleProvider = await prisma.userProvider.findFirst({
          where: {
            userId: user.userId,
            providerType: UserProviderTypeEnum.GOOGLE,
            deletedAt: null,
          }
        });
        if(findGoogleProvider) {
          return done(null, { ...user, googleToken: token, provider: UserProviderTypeEnum.GOOGLE });
        } else {
          const newUser = await prisma.userProvider.create({
            data: {
              idOrPassword: profile.id,
              providerType: UserProviderTypeEnum.GOOGLE,
              userId: user.userId
            }
          })
          return done(null, {
            ...newUser,
            googleToken: token,
            provider: UserProviderTypeEnum.GOOGLE,
          });
        }
      } 
      else {
        const newUser = await prisma.user.create({
          data: {
            email: profile.emails?.[0]?.value!,
            status: UserStatusEnum.ACTIVE,
            avatarImg: profile.photos?.[0]?.value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            isVerified: profile.emails?.[0]?.verified ? true : false,
            provider: {
              create: {
                idOrPassword: profile.id,
                providerType: UserProviderTypeEnum.GOOGLE,
              },
            },
          },
        });
        return done(null, {
          ...newUser,
          googleToken: token,
          provider: UserProviderTypeEnum.GOOGLE,
        });
      };
    } catch (error) {
      return done(error as Error);
    };
  }
);

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (obj, done) {
  return done(null, obj ?? null);
});

passport.use(loginWithGoogle);
