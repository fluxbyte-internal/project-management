import jwt from 'jsonwebtoken';
import { MyJwtPayload } from '../types/jwt.js';
import { settings } from '../config/settings.js';

export function createJwtToken(payload: MyJwtPayload, isRefreshToken = false) {
  const expiresIn = isRefreshToken ? settings.jwt.refreshTokenExipryTime : settings.jwt.tokenExipryTime
  return jwt.sign(
    payload,
    settings.jwt.privateKey,
    { expiresIn: expiresIn, algorithm: 'HS256' }
  );
};

export function verifyJwtToken(token: string) {
  return jwt.verify(token, settings.jwt.privateKey) as MyJwtPayload
};