import { PropsWithChildren } from 'react';
import useCurrentUserQuery from '@/api/query/useCurrentUserQuery';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';

const AuthGuard = (props: PropsWithChildren) => {
  const { user } = useUser();
  const { logout } = useAuth();
  const { error, isFetched, isSuccess } = useCurrentUserQuery();
  const { children } = props;

  if (!user && isFetched && isSuccess) {
    if (error) {
      logout();
      return 'Invalid session';
    }
    return <Loader />;
  }
  return children;
};

export default AuthGuard;
