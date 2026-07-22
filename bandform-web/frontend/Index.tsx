import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import App from './App';
import { ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';
import { ApolloProvider} from '@apollo/client/react';
function Index() {

	return (
		<div>Index</div>
	)
}

const client = new ApolloClient({
	link: new HttpLink({
		uri: 'http://localhost:8080/graphql',
		credentials: 'include',
	}),
	cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.querySelector("#index")!).render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ApolloProvider>
)
