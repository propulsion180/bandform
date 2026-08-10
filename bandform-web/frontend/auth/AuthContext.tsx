import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/queries";
import { GetMeQuery } from "../gql/graphql";

export type CurrentUser = NonNullable<GetMeQuery["me"]>;

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  setUser: (user: CurrentUser | null) => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, refetch } = useQuery(GET_ME, { fetchPolicy: "network-only" });
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  // Fetch the authenticated `me` after login: the login mutation's own
  // response resolves fields while the request is still anonymous (the session
  // cookie is only being set on that response), so self-only fields like email
  // come back null there. A follow-up query carries the cookie and resolves them.
  const refreshUser = async () => {
    const result = await refetch();
    setUser(result.data?.me ?? null);
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "OWNER";

  return (
    <AuthContext.Provider value={{ user, loading: loading && user === null, setUser, refreshUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
