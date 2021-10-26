import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
    split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import ReactDOM from "react-dom";
import App from "./App";

const httpLink: ApolloLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
});

const wsLink = new WebSocketLink({
    uri: "ws://localhost:4000/subscriptions",
    options: {
        reconnect: true,
    },
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);

export {};
