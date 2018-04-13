import React, { Component, createRef } from 'react';
import validate from 'validate.js';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Field from '../field';
import Notification from '../notification';

const MUTATION_CREATE_POST = gql`
  mutation createPost($url: String!, $description: String!) {
    createPost(url: $url, description: $description) {
      id
    }
  }
`;

class Submit extends Component {
  state = {
    url: '',
    description: '',
    formError: null,
    errors: {},
    isLoading: false
  };

  urlInput = createRef();

  static get RULES() {
    return {
      url: {
        presence: {
          allowEmpty: false
        }
      },
      description: {
        presence: {
          allowEmpty: false
        }
      }
    };
  }

  componentDidMount() {
    this.urlInput.current.focus();
  }

  handleChange({ target }) {
    const { name, value } = target;
    const errors = validate({ [name]: value }, { [name]: Submit.RULES[name] });

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
    const { url, description } = this.state;
    const errors = validate({ url, description }, Submit.RULES);

    if (errors) {
      return this.setState({ formError: null, errors });
    }

    this.setState({ isLoading: true }, () =>
      this.props.mutationCreatePost({ variables: { url, description } })
        .then(() => this.props.history.push('/'))
        .catch(err => this.setState({
          isLoading: false,
          formError: err.message
        }))
    );
  }

  render() {
    return (
      <section className="section">
        <div className="container container-sm">
          <div className="box">
            <h1 className="title is-4">Submit New Post</h1>
            <form onSubmit={e => this.handleSubmit(e)}>
              {this.state.formError ? (
                <Notification
                  type="danger"
                  onCloseBtnClick={e => this.setState({ formError: null })}
                >
                  {this.state.formError}
                </Notification>
              ) : null}

              <Field label="URL" errors={this.state.errors.url}>
                <input
                  name="url"
                  type="text"
                  placeholder="URL"
                  ref={this.urlInput}
                  value={this.state.url}
                  disabled={this.state.isLoading}
                  onChange={e => this.handleChange(e)}
                />
              </Field>
              <Field label="Description" errors={this.state.errors.description}>
                <input
                  name="description"
                  type="text"
                  placeholder="Description"
                  value={this.state.description}
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
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default graphql(MUTATION_CREATE_POST, { name: 'mutationCreatePost' })(Submit);
