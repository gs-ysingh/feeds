import { gql } from '@apollo/client';

export const FEEDS_QUERY = gql`
  query Feeds($after: String, $limit: Int) {
    feeds(after: $after, limit: $limit) {
      edges {
        id
        author
        image
        content
        createdAt
        likes
        comments {
          id
          author
          content
          createdAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
