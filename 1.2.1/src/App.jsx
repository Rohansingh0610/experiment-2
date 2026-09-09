import { useSelector } from 'react-redux';
import { selectAllPosts } from './features/posts/postsSlice';
import { selectAllPlatforms } from './features/platforms/platformsSlice';
import PostManager from './components/PostManager';

function App() {
  const posts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);

  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const draftCount = posts.filter((p) => p.status === 'Draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'Scheduled').length;

  return (
    <div className="app-container">
      {/* College Lab Experiment Header */}
      <header className="app-header">
        <div className="lab-badge-row">
          <span className="badge-primary">Full Stack - II Lab</span>
          <span className="badge-secondary">Experiment 1.2.1</span>
        </div>
        <h1 className="app-title">Centralized State Management Using Redux Toolkit</h1>
        <p className="app-aim">
          <strong>Aim:</strong> Design and implement a centralized state management system
          using Redux Toolkit for managing posts and platform-related data.
        </p>

        {/* Global Store Stats Ribbon */}
        <div className="stats-ribbon">
          <div className="stat-card">
            <span className="stat-label">Total Posts</span>
            <span className="stat-value">{posts.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Published</span>
            <span className="stat-value stat-published">{publishedCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Drafts</span>
            <span className="stat-value stat-draft">{draftCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Scheduled</span>
            <span className="stat-value stat-scheduled">{scheduledCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Platforms</span>
            <span className="stat-value">{platforms.length}</span>
          </div>
        </div>
      </header>

      {/* Main Post & Platform Manager */}
      <main className="main-content">
        <PostManager />
      </main>

      {/* Educational Footer explaining Redux Data Flow */}
      <footer className="app-footer">
        <div className="flow-explanation">
          <h4>🔄 Redux Toolkit Unidirectional Data Flow in this Experiment:</h4>
          <div className="flow-steps">
            <div className="flow-step">
              <span className="step-num">1</span>
              <div>
                <strong>UI Trigger</strong>
                <p>User clicks Add/Edit/Delete in <code>PostManager.jsx</code></p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-num">2</span>
              <div>
                <strong>Dispatch</strong>
                <p><code>useDispatch()</code> dispatches action (e.g. <code>addPost()</code>)</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-num">3</span>
              <div>
                <strong>Reducer Update</strong>
                <p>Slice reducer mutates state safely via Immer (updates <code>byId</code> & <code>allIds</code>)</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-num">4</span>
              <div>
                <strong>Central Store</strong>
                <p><code>store.js</code> updates global state tree</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="step-num">5</span>
              <div>
                <strong>Re-render</strong>
                <p><code>useSelector()</code> detects changes and components re-render with fresh data</p>
              </div>
            </div>
          </div>
        </div>
        <p className="copyright">Full Stack - II Lab Submission • Built with React 19, Vite & Redux Toolkit</p>
      </footer>
    </div>
  );
}

export default App;