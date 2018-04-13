import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Feed from './feed';
import Emoji from './emoji';

const FEED_QUERY = gql`
  query {
    feed {
      posts {
        id
        description
        url
        postedBy {
          name
        }
        votes {
          id
        }
      }
    }
  }
`;

const Loader = () => (
  <div className="notification has-text-centered">
    <Emoji value="⏳" label="hoursglass" /> Loading...
  </div>
);

const ErrorNotification = ({ message }) => (
  <div className="notification is-danger">
    <Emoji value="⚠️" label="warning-sign" /> {message}
  </div>
);

const FeedContainer = ({ feedQuery: { loading, error, feed } }) => (
  loading ?
    <Loader /> : error ?
    <ErrorNotification message={error.message} /> : feed ?
    <Feed posts={feed.posts} /> : null
);

export default graphql(FEED_QUERY, { name: 'feedQuery' })(FeedContainer);
