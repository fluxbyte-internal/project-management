type TokenExpiryTime = `${number}y` | `${number} days` | `${number}d` | `${number} hrs` | `${number}h` | `${number}m` | `${number}s`

export type Settings = {
  port: string;
  jwt: {
    refreshTokenCookieKey: string,
    tokenExipryTime: TokenExpiryTime
    refreshTokenExipryTime: TokenExpiryTime,
    privateKey: string,
  },
  encryption: {
    saltRound: number;
  };
  user: {
    username: string;
    password: string;
  };
};

const { PORT, PRIVATE_KEY_FOR_JWT, ROOT_USER_USERNAME, ROOT_USER_PASSWORD } =
  process.env;

if (!PRIVATE_KEY_FOR_JWT) {
  throw Error("Missing jwt private key in .env");
}

if (!ROOT_USER_USERNAME || !ROOT_USER_PASSWORD) {
  console.warn("Missing username and password");
}

export const settings: Settings = {
  port: PORT! ?? 8000,
  jwt: {
    refreshTokenCookieKey: "refresh-token",
    tokenExipryTime: `1 days`,
    refreshTokenExipryTime: `7 days`,
    privateKey: PRIVATE_KEY_FOR_JWT,
  },
  encryption: {
    saltRound: 10,
  },
  user: {
    username: ROOT_USER_USERNAME??"",
    password: ROOT_USER_PASSWORD??"",
  },
};
