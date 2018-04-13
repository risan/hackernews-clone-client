import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import validate from 'validate.js';
import { withAuth } from '../auth/auth-context';
import Field from '../field';
import Notification from '../notification';

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    formError: null,
    errors: {},
    isLoading: false
  };

  nameInput = createRef();

  static get RULES() {
    return {
      name: {
        presence: {
          allowEmpty: false
        }
      },
      email: {
        presence: {
          allowEmpty: false
        },
        email: true
      },
      password: {
        presence: {
          allowEmpty: false
        },
        length: {
          minimum: 6
        }
      }
    };
  }

  componentDidMount() {
    this.nameInput.current.focus();
  }

  handleChange({ target }) {
    const { name, value } = target;
    const errors = validate({ [name]: value }, { [name]: Signup.RULES[name] });

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
    const { name, email, password } = this.state;
    const errors = validate({ name, email, password }, Signup.RULES);

    if (errors) {
      return this.setState({ formError: null, errors });
    }

    this.setState({ isLoading: true }, () =>
      this.props.auth.signup(name, email, password)
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
            <h1 className="title is-4">Create New Account</h1>
            <form onSubmit={e => this.handleSubmit(e)}>
              {this.state.formError ? (
                <Notification
                  type="danger"
                  onCloseBtnClick={e => this.setState({ formError: null })}
                >
                  {this.state.formError}
                </Notification>
              ) : null}

              <Field label="Name" errors={this.state.errors.name}>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  ref={this.nameInput}
                  value={this.state.name}
                  disabled={this.state.isLoading}
                  onChange={e => this.handleChange(e)}
                />
              </Field>
              <Field label="Email" errors={this.state.errors.email}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
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
                    Register
                  </button>
                </div>
              </div>
            </form>
            <div className="content" style={{ marginTop: 10 }}>
              <p>
                Already have an account? <Link to="/login">Login</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withAuth(Signup);
