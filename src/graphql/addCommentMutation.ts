import { gql } from '@apollo/client';

export const ADD_COMMENT_MUTATION = gql`
  mutation AddComment($postId: ID!, $author: String!, $content: String!) {
    addComment(postId: $postId, author: $author, content: $content) {
      id
      comments {
        id
        author
        content
        createdAt
      }
    }
  }
`;
