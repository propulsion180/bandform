import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/queries";
import { GetMeQuery } from "../gql/graphql";

export type CurrentUser = NonNullable<GetMeQuery["me"]>;

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  setUser: (user: CurrentUser | null) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, loading } = useQuery(GET_ME, { fetchPolicy: "network-only" });
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  const isAdmin = user?.role === "ADMIN" || user?.role === "OWNER";

  return (
    <AuthContext.Provider value={{ user, loading: loading && user === null, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
