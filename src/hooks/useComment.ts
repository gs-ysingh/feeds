import { gql } from '@apollo/client';
import { useMutation } from './useMutation';

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

interface AddCommentData {
  addComment: {
    id: string;
    comments: Array<{
      id: string;
      author: string;
      content: string;
      createdAt: string;
    }>;
  };
}

interface AddCommentVariables {
  postId: string;
  author: string;
  content: string;
}

export function useComment() {
  const { mutate: addComment, loading, error } = useMutation<AddCommentData, AddCommentVariables>(
    ADD_COMMENT_MUTATION
  );
  
  return { addComment, loading, error };
}
