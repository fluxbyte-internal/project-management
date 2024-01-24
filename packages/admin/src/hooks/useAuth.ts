<<<<<<< HEAD
import useLogOutMutation from "@/api/mutation/useLogOutMutation";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export function useAuth() {
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AuthContext);
  const logOutMutation = useLogOutMutation();

  const logout = () => {
    logOutMutation.mutate({} as unknown as void, {
      onSuccess(data) {
        toast.success(data.data.message);
      },
    });

    setAuthUser(null);
    navigate("/login");
  };

  const login = () => {
    navigate("/");
  };

  return { login, logout };
=======
import { LoginApiResponse } from "@/api/mutation/useLoginMutation";
import { AxiosResponseAndError } from "@/api/types/axiosResponseType";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = 'Token';

export function useAuth() {
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AuthContext);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));

  const logout = () => {
    localStorage.clear();
    setAuthUser(null);
    setToken(null);
    navigate("/login");
  };

  const login = (data: AxiosResponseAndError<LoginApiResponse>["response"]) => {
    const token = data.data.data.token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setToken(token);
      navigate("/");
    } else {
      logout();
    }
  };


  return { login, logout, token };
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
}
