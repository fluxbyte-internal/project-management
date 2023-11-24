import { useUser } from "@/hooks/useUser";
import { ReactNode } from "react";
import { Navigate } from "react-router";

const OrganisationGuard = (props: { children: ReactNode }) => {
  const { children } = props;
  const { user } = useUser();
  
  if (user && user.userOrganisation.length === 0) {
    return <Navigate to="/"></Navigate>;
  } else{
    return children;
  }
};

export default OrganisationGuard;
