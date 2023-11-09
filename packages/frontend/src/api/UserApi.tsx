import axios, { isAxiosError } from "axios";
import { authLoginSchema } from "backend/src/schemas/authSchema";
import { authSignUpSchema } from "backend/src/schemas/authSchema";
import { requestURLs } from "../Environment";
import { z } from "zod";

export const loginApiRequest = async (
  data: z.infer<typeof authLoginSchema>
) => {
  try {
    const response = await axios.post(requestURLs.login, data);
    return {
      data: response.data.data,
      error: null,
      message: response.data.message,
      isSuccess: true,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        data: null,
        error: error.response?.data?.error,
        message: error.response?.data?.message,
        isSuccess: false,
      };
    } else {
      return {
        data: null,
        error: null,
        message: "Something went wrong.",
        isSuccess: false,
      };
    }
  }
};

export const signupApiRequest = async (
  data: z.infer<typeof authSignUpSchema>
) => {
  try {
    const response = await axios.post(requestURLs.signup, data);
    return {
      data: response.data.data,
      error: null,
      message: response.data.message,
      isSuccess: true,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        data: null,
        error: error.response?.data?.error,
        message: error.response?.data?.message,
        isSuccess: false,
      };
    } else {
      return {
        data: null,
        error: null,
        message: "Something went wrong.",
        isSuccess: false,
      };
    }
  }
};
