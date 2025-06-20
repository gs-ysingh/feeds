import React, { useState } from 'react';
import { LazyImage } from './LazyImage';
import { useLikePost } from '../hooks/useLikePost';
import { useComment } from '../hooks/useComment';

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

// SimpleMarkdown: supports **bold**, *italic*, and line breaks
function SimpleMarkdown({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line
            .split(/(\*\*[^*]+\*\*)/g)
            .map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                part.split(/(\*[^*]+\*)/g).map((sub, k) =>
                  sub.startsWith('*') && sub.endsWith('*') ? (
                    <em key={k}>{sub.slice(1, -1)}</em>
                  ) : (
                    <React.Fragment key={k}>{sub}</React.Fragment>
                  )
                )
              )
            )}
          <br />
        </span>
      ))}
    </>
  );
}

// Simple markdown-like rendering for **bold** and *italic*
function renderRichText(text: string) {
  return <SimpleMarkdown text={text} />;
}

export const FeedItem: React.FC<FeedItemProps> = ({ feed }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const { likePost, loading: liking, error: likeError } = useLikePost();
  const { addComment, loading: addingComment, error: commentError } = useComment();

  const handleLike = async () => {
    await likePost({ variables: { id: feed.id } });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment({
      variables: {
        postId: feed.id,
        author: commentAuthor,
        content: commentContent,
      },
      refetchQueries: ['Feeds'],
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
        <button
          aria-label="like post"
          title="Like"
          onClick={handleLike}
          disabled={liking}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
        >
          ❤️ {feed.likes}
        </button>
        <span
          aria-label="comments"
          title="Comments"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowCommentBox((v) => !v)}
        >
          💬 {feed.comments.length}
        </span>
      </div>
      {likeError && <div style={{ color: 'red' }}>Error liking post: {likeError.message}</div>}
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
      {commentError && <div style={{ color: 'red' }}>Error adding comment: {commentError.message}</div>}
    </article>
  );
};
