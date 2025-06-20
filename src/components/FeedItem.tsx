import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { LazyImage } from './LazyImage';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface FeedItemProps {
  feed: {
    id: string;
    author: string;
    image: string;
    content: string;
    createdAt: string;
    likes: number;
    comments: Comment[];
  };
}

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

// Simple markdown-like rendering for **bold** and *italic*
function renderRichText(text: string) {
  if (!text) return null;
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export const FeedItem: React.FC<FeedItemProps> = ({ feed }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [addComment, { loading: addingComment }] = useMutation(ADD_COMMENT_MUTATION, {
    refetchQueries: ['Feeds'],
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment({
      variables: {
        postId: feed.id,
        author: commentAuthor,
        content: commentContent,
      },
    });
    setCommentAuthor('');
    setCommentContent('');
    setShowCommentBox(false);
  };

  return (
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
        <span aria-label="likes" title="Likes">❤️ {feed.likes}</span>
        <span
          aria-label="comments"
          title="Comments"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowCommentBox((v) => !v)}
        >
          💬 {feed.comments.length}
        </span>
      </div>
      <footer style={{ fontSize: 12, color: '#888' }}>
        {new Date(feed.createdAt).toLocaleString()}
      </footer>
      {feed.comments.length > 0 && (
        <section style={{ marginTop: 12 }}>
          <strong>Comments:</strong>
          <ul style={{ paddingLeft: 20 }}>
            {feed.comments.map(comment => (
              <li key={comment.id} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 'bold' }}>{comment.author}:</span> {comment.content}
                <span style={{ color: '#aaa', fontSize: 10, marginLeft: 8 }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="Your name"
            value={commentAuthor}
            onChange={e => setCommentAuthor(e.target.value)}
            required
            style={{ marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            required
            style={{ marginRight: 8, width: 200 }}
          />
          <button type="submit" disabled={addingComment}>
            {addingComment ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
    </article>
  );
};
