import { Navigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

const OrganisationGuard = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  if (user && user.userOrganisation.length === 0) {
    return <Navigate to="/"></Navigate>;
  }
  return <Outlet />;
};

export default OrganisationGuard;
