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
}
