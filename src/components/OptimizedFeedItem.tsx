import React, { memo, useState, useCallback, useMemo } from 'react';
import { LazyImage } from './LazyImage';
import { SimpleMarkdown } from './SimpleMarkdown';
import { ErrorMessage } from './ErrorMessage';
import { useLikePost } from '../hooks/useLikePost';
import { useComment } from '../hooks/useComment';
import { useFormInputs } from '../hooks/useFormInputs';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface OptimizedFeedItemProps {
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

/**
 * Optimized FeedItem with React.memo and performance optimizations
 * Prevents unnecessary re-renders and optimizes expensive operations
 */
const OptimizedFeedItem: React.FC<OptimizedFeedItemProps> = memo(({ feed }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { likePost, loading: liking, error: likeError } = useLikePost();
  const { addComment, loading: addingComment, error: commentError } = useComment();
  
  const { values, handleInputChange, resetForm } = useFormInputs({
    author: '',
    content: ''
  });

  const handleLike = useCallback(async () => {
    await likePost({ variables: { id: feed.id } });
  }, [likePost, feed.id]);

  const handleCommentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment({
      variables: {
        postId: feed.id,
        author: values.author,
        content: values.content,
      },
      refetchQueries: ['Feeds'],
    });
    resetForm();
    setShowCommentBox(false);
  }, [addComment, feed.id, values.author, values.content, resetForm]);

  const toggleCommentBox = useCallback(() => {
    setShowCommentBox(prev => !prev);
  }, []);

  // Memoize formatted date to prevent recalculation
  const formattedDate = useMemo(() => {
    return new Date(feed.createdAt).toLocaleString();
  }, [feed.createdAt]);

  // Memoize image alt text
  const imageAlt = useMemo(() => {
    return feed.content?.slice(0, 40) || 'Feed image';
  }, [feed.content]);

  return (
    <article
      className="feed-item"
      tabIndex={0}
      aria-label={`Post by ${feed.author}`}
      style={{ 
        border: '1px solid #eee', 
        margin: '1rem 0', 
        borderRadius: 8, 
        padding: 16,
        // Add will-change for better performance
        willChange: 'transform',
      }}
    >
      <header style={{ fontWeight: 'bold', marginBottom: 8 }}>
        {feed.author}
      </header>
      
      <LazyImage
        src={feed.image}
        alt={imageAlt}
        loading="lazy"
        style={{ 
          width: '100%', 
          maxHeight: 400, 
          objectFit: 'cover', 
          borderRadius: 8,
          // Optimize for animations
          transform: 'translateZ(0)',
        }}
      />
      
      <section style={{ margin: '12px 0' }}>
        <SimpleMarkdown text={feed.content} />
      </section>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
        <button
          aria-label="like post"
          title="Like"
          onClick={handleLike}
          disabled={liking}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: liking ? 'not-allowed' : 'pointer', 
            fontSize: 18,
            opacity: liking ? 0.6 : 1,
          }}
        >
          ❤️ {feed.likes}
        </button>
        
        <button
          aria-label="comments"
          title="Comments"
          onClick={toggleCommentBox}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          💬 {feed.comments.length}
        </button>
      </div>
      
      <ErrorMessage error={likeError} prefix="Error liking post" />
      
      <footer style={{ fontSize: 12, color: '#888' }}>
        {formattedDate}
      </footer>
      
      {feed.comments.length > 0 && (
        <CommentsList comments={feed.comments} />
      )}
      
      {showCommentBox && (
        <CommentForm
          onSubmit={handleCommentSubmit}
          values={values}
          handleInputChange={handleInputChange}
          isSubmitting={addingComment}
        />
      )}
      
      <ErrorMessage error={commentError} prefix="Error adding comment" />
    </article>
  );
});

OptimizedFeedItem.displayName = 'OptimizedFeedItem';

// Memoized comments list to prevent unnecessary re-renders
const CommentsList: React.FC<{ comments: Comment[] }> = memo(({ comments }) => (
  <section style={{ marginTop: 12 }}>
    <strong>Comments:</strong>
    <ul style={{ paddingLeft: 20 }}>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  </section>
));

CommentsList.displayName = 'CommentsList';

// Memoized individual comment item
const CommentItem: React.FC<{ comment: Comment }> = memo(({ comment }) => {
  const formattedDate = useMemo(() => {
    return new Date(comment.createdAt).toLocaleString();
  }, [comment.createdAt]);

  return (
    <li style={{ marginBottom: 4 }}>
      <span style={{ fontWeight: 'bold' }}>{comment.author}:</span> {comment.content}
      <span style={{ color: '#aaa', fontSize: 10, marginLeft: 8 }}>
        {formattedDate}
      </span>
    </li>
  );
});

CommentItem.displayName = 'CommentItem';

// Memoized comment form
const CommentForm: React.FC<{
  onSubmit: (e: React.FormEvent) => void;
  values: { author: string; content: string };
  handleInputChange: (key: 'author' | 'content') => (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}> = memo(({ onSubmit, values, handleInputChange, isSubmitting }) => (
  <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
    <input
      type="text"
      placeholder="Your name"
      value={values.author}
      onChange={handleInputChange('author')}
      required
      style={{ marginRight: 8 }}
    />
    <input
      type="text"
      placeholder="Add a comment..."
      value={values.content}
      onChange={handleInputChange('content')}
      required
      style={{ marginRight: 8, width: 200 }}
    />
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Posting...' : 'Post'}
    </button>
  </form>
));

CommentForm.displayName = 'CommentForm';

export { OptimizedFeedItem };
