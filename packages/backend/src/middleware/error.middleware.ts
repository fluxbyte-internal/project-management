import * as Express from 'express';
import { ApiError } from '../config/apiError.js';

export class ErrorHandlerMiddleware{
    static handler(error:any, request: Express.Request, response: Express.Response, next: Express.NextFunction){
        ApiError.handle(error, response);
    }
};