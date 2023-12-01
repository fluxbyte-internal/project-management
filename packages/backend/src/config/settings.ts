type TokenExpiryTime =
  | `${number}y`
  | `${number} days`
  | `${number}d`
  | `${number} hrs`
  | `${number}h`
  | `${number}m`
  | `${number}s`;

export type Settings = {
  port: string;
  jwt: {
    refreshTokenCookieKey: string;
    tokenExipryTime: TokenExpiryTime;
    refreshTokenExipryTime: TokenExpiryTime;
    privateKey: string;
  };
  encryption: {
    saltRound: number
  },
  emailCredentials: {
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
  },
  appURL: string,
  user: {
    username: string;
    password: string;
  };
  noReplyEmailId: string
};

const {
  PORT,
  PRIVATE_KEY_FOR_JWT,
  EMAIL_ACCESS_KEY_ID,
  EMAIL_SECRET_ACCESS_KEY,
  EMAIL_REGION,
  APP_URL,
  ROOT_USER_USERNAME,
  ROOT_USER_PASSWORD,
  NO_REPLY_EMAIL } = process.env;

if (!PRIVATE_KEY_FOR_JWT) {
  throw Error('Missing jwt private key in .env')
};
if (!EMAIL_ACCESS_KEY_ID || !EMAIL_SECRET_ACCESS_KEY) {
  throw Error("Missing email credentials in .env");
};

if (!EMAIL_REGION) {
  throw Error('Missing email region in .env');
};

if (!APP_URL) {
  throw Error('Missing APP_URL in .env');
};

if (!PRIVATE_KEY_FOR_JWT) {
  throw Error("Missing jwt private key in .env");
};

if (!ROOT_USER_USERNAME || !ROOT_USER_PASSWORD) {
  console.warn("Missing username and password");
};

if (!NO_REPLY_EMAIL) {
  throw Error("Missing NO_REPLY_EMAIL in .env");
};

export const settings: Settings = {
  port: PORT! ?? 8000,
  jwt: {
    refreshTokenCookieKey: "refresh-token",
    tokenExipryTime: `1 days`,
    refreshTokenExipryTime: `7 days`,
    privateKey: PRIVATE_KEY_FOR_JWT,
  },
  encryption: {
    saltRound: 10
  },
  emailCredentials: {
    accessKeyId: EMAIL_ACCESS_KEY_ID,
    secretAccessKey: EMAIL_SECRET_ACCESS_KEY,
    region: EMAIL_REGION
  },
  appURL: APP_URL,
  user: {
    username: ROOT_USER_USERNAME ?? "",
    password: ROOT_USER_PASSWORD ?? "",
  },
  noReplyEmailId: NO_REPLY_EMAIL
};
