import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.scss";
import App from "./App";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "./auth/AuthContext";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8080/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Band: {
        fields: {
          members: { merge: false },
          joinRequests: { merge: false },
          openPositions: { merge: false },
        },
      },
    },
  }),
});

ReactDOM.createRoot(document.querySelector("#index")!).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  </ApolloProvider>
);
