import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { ImageUploader } from './ImageUploader';
import { useNavigate } from 'react-router-dom';
import { FEEDS_QUERY } from '../graphql/feedsQuery';

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($author: String!, $image: String!, $content: String!) {
    createPost(author: $author, image: $image, content: $content) {
      id
      author
      image
      content
      createdAt
    }
  }
`;

export const Post: React.FC = () => {
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [{ query: FEEDS_QUERY }],
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await createPost({ variables: { author, image, content } });
      setAuthor('');
      setImage('');
      setContent('');
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000); // Redirect to feed after success
    } catch (e) {
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '2rem 0', padding: 16, border: '1px solid #eee', borderRadius: 8 }} aria-label="Create a new post">
      <h2>Create a New Post</h2>
      <div style={{ marginBottom: 8 }}>
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <ImageUploader onImageUpload={setImage} />
      {image && (
        <div style={{ marginBottom: 8 }}>
          <img src={image} alt="Preview" style={{ maxWidth: 200, borderRadius: 8 }} />
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <label>
          Content:
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={3}
            style={{ marginLeft: 8, width: '100%' }}
          />
        </label>
      </div>
      <button type="submit" disabled={loading || !image} style={{ padding: '0.5em 1em' }}>
        {loading ? 'Posting…' : 'Post'}
      </button>
      {success && <div style={{ color: 'green', marginTop: 8 }}>Post created!</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>Error: {error.message}</div>}
    </form>
  );
};
