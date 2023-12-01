import crypto from "crypto";

export function generateRandomToken(length: number = 20) {
  return crypto.randomBytes(length).toString('hex');
};
