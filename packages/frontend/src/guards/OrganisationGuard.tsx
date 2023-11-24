import { useUser } from "@/hooks/useUser";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

const OrganisationGuard = (props: PropsWithChildren) => {
  const { children } = props;
  const { user } = useUser();
  
  if (user && user.userOrganisation.length === 0) {
    return <Navigate to="/"></Navigate>;
  } else{
    return children;
  }
};

export default OrganisationGuard;
