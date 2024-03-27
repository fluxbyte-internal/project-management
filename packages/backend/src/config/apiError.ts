import { ReasonPhrases, StatusCodes, getStatusCode } from "http-status-codes";
import { Response } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { PRISMA_ERROR_CODE } from "../constants/prismaErrorCodes.js";

type ReturnStatus = number | StatusCodes;

abstract class ApiResponse {
  constructor(
    protected status: StatusCodes,
    protected message: string,
    protected code: ReturnStatus
  ) {}

  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T
  ): Response {
    return res.status(this.status).send(ApiResponse.sanitize(response));
  }

  public send(res: Response): Response {
    return this.prepare<ApiResponse>(res, this);
  }

  private static sanitize<T extends ApiResponse>(response: T): T {
    const clone: T = <T>{};
    Object.assign(clone, response);

    // @ts-ignore
    delete clone.status;

    for (const i in clone) if (typeof clone[i] === "undefined") delete clone[i];
    return clone;
  }
};

export class SuccessResponse<T> extends ApiResponse {
  constructor(
    code: StatusCodes,
    private data?: T,
    message: string = "Success",
    returnCode: ReturnStatus = code
  ) {
    super(code, message, returnCode);
  }

  send(res: Response): Response {
    return super.prepare<SuccessResponse<T>>(res, this);
  }
};

export class ErrorResponse<T> extends ApiResponse {
  constructor(
    code: StatusCodes,
    private data?: T,
    message: string = "Error",
    returnCode: ReturnStatus = code
  ) {
    super(code, message, returnCode);
  }

  send(res: Response): Response {
    return super.prepare<ErrorResponse<T>>(res, this);
  }
};

export class ZodResponse<T> extends ApiResponse {
  constructor(
    code: StatusCodes,
    private errors?: T,
    errorMsg: string = "Error",
    returnCode: ReturnStatus = code
  ) {
    super(code, errorMsg, returnCode);
  }
  send(res: Response): Response {
    return super.prepare<ZodResponse<T>>(res, this);
  }
};

export abstract class ApiError extends Error {
  constructor(
    public type: ReasonPhrases,
    public message: string = "error",
    public data?: any,
    public code?: string | number
  ) {
    super(type as string);
  }

  public static handle(err: ApiError, res: Response): Response {
    if (err.type) {
      try {
        const code = getStatusCode(err.type);
        return new ErrorResponse<any>(code, err.data, err.message).send(
          res
        );
      } catch (e) {
        throw new GenericError(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          err.message,
          err.data
        );
      }
    } else if (err instanceof ZodError) {
      return new ZodResponse<any>(
        StatusCodes.BAD_REQUEST,
        err.issues,
      ).send(res);
    }
    else if (err instanceof PrismaClientKnownRequestError) {
      let code = StatusCodes.INTERNAL_SERVER_ERROR;
      let message: string = ReasonPhrases.INTERNAL_SERVER_ERROR;
      switch (err.code) {
        case PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT:
          message = `There is a unique constraint violation, a new data cannot be created or updated`;
          break;
        case PRISMA_ERROR_CODE.FOREIGN_CONSTRAINT:
          message = `Foreign key constraint failed`;
          break;
        case PRISMA_ERROR_CODE.NOT_FOUND:
          message =
            typeof err.meta?.cause == "string" ? err.meta.cause : err.message;
          code = StatusCodes.NOT_FOUND;
          break;
      }
      return new ErrorResponse(
        code, undefined, message, 
      ).send(res);
    }
    else {
      console.error(err)
      return new ErrorResponse<any>(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.data,
        err.message
      ).send(res);
    }
  }
};

export class GenericError extends ApiError {
  constructor(
    type: ReasonPhrases,
    message: string = "Bad Request",
    data?: any
  ) {
    super(type, message, data);
  }
};

export class BadRequestError extends ApiError {
  constructor(message: string = ReasonPhrases.BAD_REQUEST) {
    super(ReasonPhrases.BAD_REQUEST, message);
  }
};

export class InternalServerError extends ApiError {
  constructor(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR) {
    super(ReasonPhrases.INTERNAL_SERVER_ERROR, message);
  }
};

export class UnAuthorizedError extends ApiError {
  constructor(message?: string) {
    super(ReasonPhrases.UNAUTHORIZED, message ? message : ReasonPhrases.UNAUTHORIZED);
  }
};

export class ForbiddenError extends ApiError {
  constructor() {
    super(ReasonPhrases.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
};

export class NotFoundError extends ApiError {
  constructor(message: string = ReasonPhrases.NOT_FOUND) {
    super(ReasonPhrases.NOT_FOUND, message);
  }
};
