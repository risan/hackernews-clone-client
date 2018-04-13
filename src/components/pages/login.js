import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import validate from 'validate.js';
import { withAuth } from '../auth/auth-context';
import Field from '../field';
import Notification from '../notification';

class Login extends Component {
  state = {
    email: '',
    password: '',
    formError: null,
    errors: {},
    isLoading: false
  };

  emailInput = createRef();

  static get RULES() {
    return {
      email: {
        presence: {
          allowEmpty: false
        },
        email: true
      },
      password: {
        presence: {
          allowEmpty: false
        }
      }
    };
  }

  componentDidMount() {
    this.emailInput.current.focus();
  }

  handleChange({ target }) {
    const { name, value } = target;
    const errors = validate({ [name]: value }, { [name]: Login.RULES[name] });

    this.setState({
      [name]: value,
      errors: Object.assign(
        {},
        this.state.errors,
        errors ? errors : { [name]: undefined }
      )
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const errors = validate({ email, password }, Login.RULES);

    if (errors) {
      return this.setState({ formError: null, errors });
    }

    this.setState({ isLoading: true }, () =>
      this.props.auth.login(email, password)
        .catch((err) => this.setState({
          isLoading: false,
          formError: err.message,
          password: ''
        }))
    );
  }

  render() {
    return (
      <section className="section">
        <div className="container container-sm">
          <div className="box">
            <h1 className="title is-4">Login</h1>
            <form onSubmit={e => this.handleSubmit(e)}>
              {this.state.formError ? (
                <Notification
                  type="danger"
                  onCloseBtnClick={e => this.setState({ formError: null })}
                >
                  {this.state.formError}
                </Notification>
              ) : null}

              <Field label="Email" errors={this.state.errors.email}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  ref={this.emailInput}
                  value={this.state.email}
                  disabled={this.state.isLoading}
                  onChange={e => this.handleChange(e)}
                />
              </Field>
              <Field label="Password" errors={this.state.errors.password}>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  disabled={this.state.isLoading}
                  onChange={e => this.handleChange(e)}
                />
              </Field>
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-link ${
                      this.state.isLoading ? 'is-loading' : ''
                      }`}
                    disabled={this.state.isLoading}
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
            <div className="content" style={{ marginTop: 10 }}>
              <p>
                Don't have an account?{' '}
                <Link to="/signup">Create new account</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withAuth(Login);
