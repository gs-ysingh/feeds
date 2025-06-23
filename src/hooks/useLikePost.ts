import { gql } from '@apollo/client';
import { useMutation } from './useMutation';

const LIKE_POST_MUTATION = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      likes
    }
  }
`;

interface LikePostData {
  likePost: {
    id: string;
    likes: number;
  };
}

interface LikePostVariables {
  id: string;
}

export function useLikePost() {
  const { mutate: likePost, loading, error } = useMutation<LikePostData, LikePostVariables>(
    LIKE_POST_MUTATION
  );
  
  return { likePost, loading, error };
}
