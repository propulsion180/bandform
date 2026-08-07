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

const httpLink = new HttpLink({
  uri: "http://localhost:8080/graphql",
  credentials: "include",
});

// The session cookie rides along on the WS upgrade request automatically,
// same as credentials:"include" does for HttpLink -- see SecurityConfig.
// If this app is ever served over https, this needs to become wss://.
const wsLink = new GraphQLWsLink(
  createClient({ url: "ws://localhost:8080/graphql-ws" })
);

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
