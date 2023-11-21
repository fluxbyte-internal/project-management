import express from 'express';

export const sendResponse = (res: express.Response, status: number, message: string, data?: any) => {
  return res.status(status).json({ status, message, data });
};