import React from 'react';
import { LazyImage } from './LazyImage';

export interface FeedItemProps {
  feed: {
    id: string;
    author: string;
    image: string;
    content: string;
    createdAt: string;
  };
}

// Simple markdown-like rendering for **bold** and *italic*
function renderRichText(text: string) {
  if (!text) return null;
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export const FeedItem: React.FC<FeedItemProps> = ({ feed }) => (
  <article
    className="feed-item"
    tabIndex={0}
    aria-label={`Post by ${feed.author}`}
    style={{ border: '1px solid #eee', margin: '1rem 0', borderRadius: 8, padding: 16 }}
  >
    <header style={{ fontWeight: 'bold', marginBottom: 8 }}>{feed.author}</header>
    <LazyImage
      src={feed.image}
      alt={feed.content?.slice(0, 40) || 'Feed image'}
      loading="lazy"
      style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
    />
    <section style={{ margin: '12px 0' }}>{renderRichText(feed.content)}</section>
    <footer style={{ fontSize: 12, color: '#888' }}>
      {new Date(feed.createdAt).toLocaleString()}
    </footer>
  </article>
);
