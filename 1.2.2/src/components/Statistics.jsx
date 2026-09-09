import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectPostStatistics } from '../features/posts/postsSelectors.js';

export default function Statistics({ onRenderTrack }) {
  // Directly consume derived statistical calculations from the memoized selector
  const stats = useSelector(selectPostStatistics);

  // Track component renders
  const renderCount = useRef(0);
  renderCount.current += 1;

  if (onRenderTrack) {
    onRenderTrack('Statistics', renderCount.current);
  }

  return (
    <section className="card stats-card">
      <div className="card-header">
        <div>
          <h3>📊 Derived Statistics Dashboard</h3>
          <p className="section-desc">
            Derived on-the-fly via <code>selectPostStatistics</code> without duplicating counts in Redux state.
          </p>
        </div>
        <div className="render-counter-pill">
          Statistics Renders: <strong>{renderCount.current}</strong>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Total Posts</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Published</span>
          <span className="stat-value stat-success">{stats.published}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Drafts</span>
          <span className="stat-value stat-warning">{stats.draft}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Scheduled</span>
          <span className="stat-value stat-info">{stats.scheduled}</span>
        </div>
      </div>

      <div className="platform-breakdown">
        <span className="breakdown-label">Platform Breakdown:</span>
        <div className="breakdown-chips">
          <span className="chip chip-linkedin">LinkedIn: {stats.linkedin}</span>
          <span className="chip chip-twitter">Twitter: {stats.twitter}</span>
          <span className="chip chip-instagram">Instagram: {stats.instagram}</span>
        </div>
      </div>
    </section>
  );
}
