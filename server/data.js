import faker from 'faker';

export const FEED_TOTAL = 100;

export function generateFeeds(count = FEED_TOTAL) {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${i + 1}`,
    author: faker.internet.userName(),
    image: `https://picsum.photos/seed/${i}/600/400`,
    content: faker.lorem.paragraphs(2),
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    likes: faker.datatype.number({ min: 0, max: 100 }),
    comments: Array.from({ length: faker.datatype.number({ min: 0, max: 3 }) }).map((_, j) => ({
      id: `${j + 1}`,
      author: faker.internet.userName(),
      content: faker.lorem.sentence(),
      createdAt: new Date(Date.now() - j * 1000 * 60 * 10).toISOString(),
    })),
  }));
}

export const feeds = generateFeeds();
