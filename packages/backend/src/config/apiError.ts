import { ReasonPhrases, StatusCodes, getStatusCode } from "http-status-codes";
import express, { Request, Response } from "express";

type ReturnStatus = number | StatusCodes;

abstract class ApiResponse {
  constructor(
    protected status: StatusCodes,
    protected message: string,
    protected code: ReturnStatus
  ) { }

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

export abstract class ApiError extends Error {
  constructor(
    public type: ReasonPhrases,
    public message: string = "error",
    public data?: any
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
    } else {
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