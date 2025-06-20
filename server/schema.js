import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Comment {
    id: ID!
    author: String!
    content: String!
    createdAt: String!
  }
  type Feed {
    id: ID!
    author: String!
    image: String!
    content: String!
    createdAt: String!
    likes: Int!
    comments: [Comment!]!
  }
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
  type FeedConnection {
    edges: [Feed!]!
    pageInfo: PageInfo!
  }
  type Query {
    feeds(after: String, limit: Int): FeedConnection!
  }
  type Mutation {
    createPost(author: String!, image: String!, content: String!): Feed!
    likePost(id: ID!): Feed!
    addComment(postId: ID!, author: String!, content: String!): Feed!
  }
`;
