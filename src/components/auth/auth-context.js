import React, { Component, createContext } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

const AuthContext = createContext();

class Provider extends Component {
  state = {
    token: localStorage.getItem('auth_token'),
    check: () => this.state.token !== null,
    guest: () => ! this.state.check(),
    signup: (name, email, password) => new Promise((resolve, reject) =>
      this.props.signupMutation({ variables: { name, email, password } })
        .then(({ data }) => {
          localStorage.setItem('auth_token', data.signup.token)
          this.setState({ token: data.signup.token });
          resolve(data);
        })
        .catch(err => reject(err))
    ),
    login: (email, password) => new Promise((resolve, reject) =>
      this.props.loginMutation({ variables: { email, password } })
        .then(({ data }) => {
          localStorage.setItem('auth_token', data.login.token)
          this.setState({ token: data.login.token });
          resolve(data);
        })
        .catch(err => reject(err))
    ),
    logout: () => {
      localStorage.removeItem('auth_token');
      this.setState({...this.state, token: null});
    }
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export const AuthProvider = compose(
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' })
)(Provider);

export const AuthConsumer = AuthContext.Consumer;

export const withAuth = Component => () => (
  <AuthConsumer>
    {value => <Component auth={value} />}
  </AuthConsumer>
);

export default AuthContext;
