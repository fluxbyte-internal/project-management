import { settings } from "../config/settings.js";
import bcrypt from 'bcrypt';

export function encrypt(value: string) {
  return bcrypt.hash(value, settings.encryption.saltRound)
};

export function compareEncryption(value: string, encryptedValue: string) {
  return bcrypt.compare(value, encryptedValue);
};