import { gql, useMutation } from '@apollo/client';

const LIKE_POST_MUTATION = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      likes
    }
  }
`;

export function useLikePost() {
  const [likePost, { loading, error }] = useMutation(LIKE_POST_MUTATION);
  return { likePost, loading, error };
}
