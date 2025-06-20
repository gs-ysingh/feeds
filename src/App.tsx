import './App.css';
import { GraphQLProvider } from './providers/GraphQLProvider';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FeedList from './components/FeedList';
import { Post } from './components/Post';
import { useScrollToTopOnRouteChange } from './hooks/useScrollToTopOnRouteChange';

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
        <Routes>
          <Route path="/" element={<FeedList />} />
          <Route path="/post" element={<Post />} />
        </Routes>
      </Router>
    </GraphQLProvider>
  );
}

export default App;
