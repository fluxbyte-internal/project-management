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
}
