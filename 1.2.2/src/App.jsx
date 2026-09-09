import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectPostsGroupedByPlatform } from './features/posts/postsSelectors.js';
import Statistics from './components/Statistics.jsx';
import Filters from './components/Filters.jsx';
import PerformanceDemo from './components/PerformanceDemo.jsx';
import PostList from './components/PostList.jsx';
import ReduxStateViewer from './components/ReduxStateViewer.jsx';

export default function App() {
  // Grouped data derived exclusively through memoized selector
  const groupedPosts = useSelector(selectPostsGroupedByPlatform);

  // Render tracking map passed to PerformanceDemo
  const [renderCounts, setRenderCounts] = useState({
    PostList: 1,
    Statistics: 1,
  });

  const handleTrackRender = useCallback((componentName, count) => {
    setRenderCounts((prev) => {
      if (prev[componentName] === count) return prev;
      return { ...prev, [componentName]: count };
    });
  }, []);

  return (
    <div className="app-container">
      {/* 1. Lab Experiment Header */}
      <header className="app-header">
        <div className="lab-badge-row">
          <span className="badge-primary">Full Stack - II Lab</span>
          <span className="badge-secondary">Experiment 1.2.2</span>
        </div>
        <h1 className="app-title">Experiment 1.2.2 - Memoized Selectors</h1>
        <h2 className="app-subtitle">Redux Performance Optimization</h2>
        <p className="app-aim">
          <strong>Aim:</strong> To optimize state access and improve application performance
          using memoized selectors (Reselect) and efficient rendering strategies.
        </p>
      </header>

      {/* 2. Educational Explanation Card */}
      <section className="card explanation-card">
        <h3>💡 Understanding Memoized Selectors & Render Optimization</h3>
        <div className="explanation-grid">
          <div className="explanation-item">
            <h4>1. Derived State</h4>
            <p>
              Data computed on-the-fly from raw store state (e.g. filtered lists, total counts).
              Instead of storing duplicate copies of counts or filtered posts in state, we compute
              them through selectors.
            </p>
          </div>
          <div className="explanation-item">
            <h4>2. What Memoization Means</h4>
            <p>
              Caching calculation results so that if the input arguments do not change (reference
              equality <code>===</code>), the selector instantly returns the cached result without
              re-executing the calculation function.
            </p>
          </div>
          <div className="explanation-item">
            <h4>3. Why <code>createSelector</code> is Useful</h4>
            <p>
              Provided by Redux Toolkit via Reselect. It creates composable, memoized selectors with
              automatic cache management, preventing costly $O(N)$ filter/aggregation recalculations
              on unrelated renders.
            </p>
          </div>
          <div className="explanation-item">
            <h4>4. Unnecessary Re-renders Problem</h4>
            <p>
              When an unmemoized selector returns a new array reference <code>[]</code> every time,
              React assumes data has changed and forces components to re-render. Memoized selectors
              maintain reference stability to prevent this waste.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Derived Statistics Component */}
      <Statistics onRenderTrack={handleTrackRender} />

      {/* 4. Grouped Data Section (Memoized Grouping) */}
      <section className="card grouped-summary-card">
        <div className="card-header">
          <div>
            <h3>📁 Grouped Posts by Platform</h3>
            <p className="section-desc">
              Derived dynamically via <code>selectPostsGroupedByPlatform</code>.
            </p>
          </div>
        </div>
        <div className="grouped-badges-row">
          {Object.entries(groupedPosts).map(([platform, list]) => (
            <div key={platform} className="grouped-badge-item">
              <span className="badge-plat-name">{platform}:</span>
              <strong className="badge-plat-count">{list.length} posts</strong>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Filter Controls */}
      <Filters />

      {/* 6. Live Performance Demonstration & Unrelated State Counter */}
      <PerformanceDemo renderCounts={renderCounts} />

      {/* 7. Memoized Post List */}
      <PostList onRenderTrack={handleTrackRender} />

      {/* 8. Redux Store Viewer */}
      <ReduxStateViewer />

      {/* Footer */}
      <footer className="app-footer">
        <p>Full Stack - II Lab Submission • Built with React 19, Redux Toolkit & Reselect</p>
      </footer>
    </div>
  );
}
