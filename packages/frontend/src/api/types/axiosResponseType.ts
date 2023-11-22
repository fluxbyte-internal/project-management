import { AxiosError, AxiosResponse } from "axios";

export type ResponseType<T> = {
  code: number;
  message: string;
  data: T;
};

export type ErrorResponseType = {
  code: number;
  message: string;
  errors: unknown;
};

export type AxiosResponseAndError<T> = {
  response: AxiosResponse<T>;
  error: AxiosError<ErrorResponseType>;
};
