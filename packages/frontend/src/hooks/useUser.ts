import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '@/context/AuthContext';
import useCurrentUserQuery from '@/api/query/useCurrentUserQuery';

export function useUser() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const fetchingUser = useRef(false);
  const { data, error, isError, isFetched, isFetching, refetch } =
    useCurrentUserQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) {
      refetch();
    }
  }, [authUser]);

  useEffect(() => {
    if (isFetching) fetchingUser.current = true;
    if (isFetched && !isFetching && fetchingUser.current) {
      const user = data?.data?.data ? data.data.data : null;
      fetchingUser.current = false;
      setAuthUser(user);

      if (user && !user.isVerified) {
        navigate('/verify-email');
      }
      if (!user) {
        if (isError) {
          toast.error(error.response?.data.message);
        }
        navigate('/login');
      }
      if (user && user.userOrganisation.length) {
        localStorage.setItem(
          'organisation-id',
          user.userOrganisation[0].organisationId,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, setAuthUser]);

  return { user: authUser };
}
