import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
const TOKEN_KEY = "token";

export function useAuth() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AuthContext);
  const [token, setToken] = useState<string | null>(cookies.get(TOKEN_KEY));

  const logout = () => {
    cookies.remove("token");
    cookies.remove("refresh-token");
    setAuthUser(null);
    setToken(null);
    navigate("/login");
  };

  const login = () => {
    const token = cookies.get("token");
    if (token) {
      setToken(token);
      navigate("/");
    } else {
      logout();
    }
  };


  return { login, logout, token };
}
