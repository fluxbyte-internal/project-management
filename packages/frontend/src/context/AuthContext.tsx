import React, { ReactNode, useState } from 'react';
import { UserType } from '@/api/query/useCurrentUserQuery';

const AuthContext = React.createContext<{
  authUser: UserType | null;
  setAuthUser: (user: UserType | null) => void;
}>({
  authUser: null,
  setAuthUser: () => {},
});

const AuthProvider = (props: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<UserType | null>(null);

  const value = {
    authUser,
    setAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
