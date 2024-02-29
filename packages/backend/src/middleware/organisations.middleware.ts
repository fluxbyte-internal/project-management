import express from "express";
import { BadRequestError } from "../config/apiError.js";

export const organisationMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.organisationId) {
    next();
  } else {
    throw new BadRequestError("organisationId not found!!");
  }
};
