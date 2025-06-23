import './App.css';
import { GraphQLProvider } from './providers/GraphQLProvider';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useScrollToTopOnRouteChange } from './hooks/useScrollToTopOnRouteChange';
import { LoadingIndicator } from './components/LoadingIndicator';

// Lazy load components for code splitting
const FeedList = lazy(() => import('./components/FeedList'));
const Post = lazy(() => import('./components/Post'));

function ScrollToTop() {
  useScrollToTopOnRouteChange();
  return null;
}

function App() {
  return (
    <GraphQLProvider>
      <Router>
        <ScrollToTop />
        <nav style={{ margin: '1rem 0' }}>
          <Link to="/" style={{ marginRight: 16 }}>Home</Link>
          <Link to="/post">
            <button type="button">Create Post</button>
          </Link>
        </nav>
        <Suspense fallback={<LoadingIndicator loading={true} text="Loading page..." />}>
          <Routes>
            <Route path="/" element={<FeedList />} />
            <Route path="/post" element={<Post />} />
          </Routes>
        </Suspense>
      </Router>
    </GraphQLProvider>
  );
}

export default App;
