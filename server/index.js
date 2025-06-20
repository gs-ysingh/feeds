import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema.js';
import faker from 'faker';

// Generate mock feed data
const FEED_TOTAL = 100;
const feeds = Array.from({ length: FEED_TOTAL }).map((_, i) => ({
  id: `${i + 1}`,
  author: faker.internet.userName(),
  image: `https://picsum.photos/seed/${i}/600/400`,
  content: faker.lorem.paragraphs(2),
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
}));

// Resolvers
const resolvers = {
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
      };
      feeds.unshift(newPost); // Add to the start for instant appearance
      return newPost;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL server ready at ${url}`);
});
