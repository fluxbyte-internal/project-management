import { useUser } from "@/hooks/useUser";
import { Navigate } from "react-router";
import { Outlet } from "react-router-dom";

const OrganisationGuard = () => {
  const { user } = useUser();
  if(!user){
    return null;
  }
  if (user && user.userOrganisation.length === 0) {
    return <Navigate to="/"></Navigate>;
  } else{
    return <Outlet />;
  }
};

export default OrganisationGuard;
