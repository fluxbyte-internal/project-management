import { settings } from "../config/settings.js";

export const cookieConfig = {
  maxAgeToken: 1 * 24 * 60 * 60 * 1000,
  maxAgeRefreshToken: 7 * 24 * 60 * 60 * 1000,
  // httpOnly: false,
  // secure: true,
  // sameSite: "none" as boolean | "none" | "lax" | "strict" | undefined,
  domain: "192.168.29.227",
};
