import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client";
import ReactDOM from "react-dom";
import App from "./App";

const link: ApolloLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
});

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);

export {};
