import React from 'react';

const Post = ({ url, description, postedBy, votes }) => (
  <li>
    <div>
      <a href={url}>
        <span>{description}</span>
        <span>({url})</span>
      </a>
    </div>
    <div>
      <span>{votes.length} Votes</span> | <span>By {postedBy.name}</span>
    </div>
  </li>
);

export default Post;
