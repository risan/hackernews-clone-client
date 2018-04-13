import React from 'react';
import Post from './post';

const Feed = ({ posts }) => (
  <ol>
    {posts.map(({ id, url, description, postedBy, votes }) => (
      <Post
        key={id}
        url={url}
        description={description}
        postedBy={postedBy}
        votes={votes}
      />
    ))}
  </ol>
);

export default Feed;
