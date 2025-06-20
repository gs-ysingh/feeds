import { feeds } from './data.js';

/**
 * GraphQL Resolvers
 */
export const resolvers = {
  Query: {
    feeds: (_parent, { after, limit = 10 }) => {
      let startIdx = 0;
      if (after) {
        const idx = feeds.findIndex(f => f.id === after);
        startIdx = idx >= 0 ? idx + 1 : 0;
      }
      const edges = feeds.slice(startIdx, startIdx + limit);
      const endCursor = edges.length ? edges[edges.length - 1].id : null;
      const hasNextPage = startIdx + limit < feeds.length;
      return {
        edges,
        pageInfo: {
          endCursor,
          hasNextPage,
        },
      };
    },
  },
  Mutation: {
    createPost: (_parent, { author, image, content }) => {
      const newPost = {
        id: `${feeds.length + 1}`,
        author,
        image,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
      };
      feeds.unshift(newPost);
      return newPost;
    },
    likePost: (_parent, { id }) => {
      const post = feeds.find(f => f.id === id);
      if (post) post.likes += 1;
      return post;
    },
    addComment: (_parent, { postId, author, content }) => {
      const post = feeds.find(f => f.id === postId);
      if (!post) return null;
      const newComment = {
        id: `${post.comments.length + 1}`,
        author,
        content,
        createdAt: new Date().toISOString(),
      };
      post.comments.push(newComment);
      return post;
    },
  },
};
