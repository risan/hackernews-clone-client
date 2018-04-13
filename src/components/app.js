import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { AuthProvider } from './auth/auth-context';
import GuestRoute from './auth/guest-route';
import ProtectedRoute from './auth/protected-route';
import Navbar from './navbar';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Submit from './pages/submit';

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('auth_token');

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <Router basename={process.env.PUBLIC_URL}>
            <Fragment>
              <Navbar />
              <Route exact path="/" component={Home} />
              <GuestRoute path="/login" component={Login} />
              <GuestRoute path="/signup" component={Signup} />
              <ProtectedRoute path="/submit" component={Submit} />
            </Fragment>
          </Router>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}

export default App;
