import { gql, useMutation } from '@apollo/client';

const ADD_COMMENT_MUTATION = gql`
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

export function useComment() {
  const [addComment, { loading, error }] = useMutation(ADD_COMMENT_MUTATION);
  return { addComment, loading, error };
}
