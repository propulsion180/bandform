import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.scss";
import App from "./App";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { AuthProvider } from "./auth/AuthContext";
import NotificationListener from "./components/NotificationListener";

// Backend origin, injected by esbuild (see esbuild.js `define`). Empty string
// means "same origin" -- used for the reverse-proxy production deploy, where the
// URLs become relative (/graphql) and the WS scheme follows the page protocol.
declare const __BF_API_ORIGIN__: string;
const API_ORIGIN = __BF_API_ORIGIN__;

const httpLink = new HttpLink({
  uri: `${API_ORIGIN}/graphql`,
  credentials: "include",
});

// The session cookie rides along on the WS upgrade request automatically,
// same as credentials:"include" does for HttpLink -- see SecurityConfig.
const wsUrl = API_ORIGIN
  ? `${API_ORIGIN.replace(/^http/, "ws")}/graphql-ws`
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/graphql-ws`;
const wsLink = new GraphQLWsLink(createClient({ url: wsUrl }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
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
        <NotificationListener />
        <App />
      </AuthProvider>
    </React.StrictMode>
  </ApolloProvider>
);
