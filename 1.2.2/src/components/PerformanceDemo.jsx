import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUnrelatedCounter,
  selectPostStatistics,
  selectPostsByPlatformAndStatus,
  selectPostsGroupedByPlatform,
  selectAllPosts,
} from '../features/posts/postsSelectors.js';
import {
  incrementUnrelatedCounter,
  decrementUnrelatedCounter,
} from '../features/filters/filtersSlice.js';
import { addPost } from '../features/posts/postsSlice.js';

export default function PerformanceDemo({ renderCounts }) {
  const dispatch = useDispatch();

  // Read unrelated state from Redux store
  const unrelatedCount = useSelector(selectUnrelatedCounter);

  // Quick form state for testing real data updates vs unrelated updates
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newStatus, setNewStatus] = useState('Published');
  const [showAddForm, setShowAddForm] = useState(false);

  // Read genuine recomputations from Reselect selectors
  const statsRecomputations = selectPostStatistics.recomputations();
  const filteredRecomputations = selectPostsByPlatformAndStatus.recomputations();
  const groupedRecomputations = selectPostsGroupedByPlatform.recomputations();
  const allPostsRecomputations = selectAllPosts.recomputations();

  const handleAddPostSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    dispatch(
      addPost({
        title: newTitle.trim(),
        platform: newPlatform,
        status: newStatus,
      })
    );
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <section className="card performance-card">
      <div className="card-header">
        <div>
          <h3>⚡ Live Performance Monitor & Memoization Test</h3>
          <p className="section-desc">
            Test and verify genuine Reselect memoization by dispatching unrelated Redux store updates.
          </p>
        </div>
        <span className="badge-active">Reselect Memoization: ACTIVE</span>
      </div>

      {/* Interactive Unrelated Counter Widget */}
      <div className="unrelated-state-box">
        <div className="unrelated-info">
          <h4>🧪 Unrelated Redux State: <code>state.filters.unrelatedCounter</code></h4>
          <p>
            Clicking [+] or [-] dispatches a genuine Redux action. The Redux store updates, but because
            memoized post selectors (<code>selectPostStatistics</code>, <code>selectPostsByPlatformAndStatus</code>)
            see that their input state has <strong>not changed</strong>, Reselect skips recalculation and returns
            the cached reference. Consequently, child components do <strong>not</strong> re-render!
          </p>
        </div>

        <div className="counter-controls">
          <button
            type="button"
            onClick={() => dispatch(decrementUnrelatedCounter())}
            className="btn btn-counter"
            title="Decrement unrelated counter"
          >
            -
          </button>
          <span className="counter-display">{unrelatedCount}</span>
          <button
            type="button"
            onClick={() => dispatch(incrementUnrelatedCounter())}
            className="btn btn-counter"
            title="Increment unrelated counter"
          >
            +
          </button>
        </div>
      </div>

      {/* Genuine Recomputations & Render Counters Grid */}
      <div className="metrics-dashboard-grid">
        <div className="metric-panel">
          <div className="metric-panel-title">Component Renders (React Lifecycle)</div>
          <div className="metric-item">
            <span><code>&lt;PostList /&gt;</code> Renders:</span>
            <strong className="metric-badge">{renderCounts.PostList || 1}</strong>
          </div>
          <div className="metric-item">
            <span><code>&lt;Statistics /&gt;</code> Renders:</span>
            <strong className="metric-badge">{renderCounts.Statistics || 1}</strong>
          </div>
          <p className="metric-note">
            Notice: Incrementing the counter above does <em>not</em> increase these render counts because
            <code>useSelector</code> sees identical selector result references.
          </p>
        </div>

        <div className="metric-panel">
          <div className="metric-panel-title">Genuine Reselect .recomputations()</div>
          <div className="metric-item">
            <span><code>selectPostStatistics</code>:</span>
            <strong className="metric-badge accent-green">{statsRecomputations}</strong>
          </div>
          <div className="metric-item">
            <span><code>selectPostsByPlatformAndStatus</code>:</span>
            <strong className="metric-badge accent-green">{filteredRecomputations}</strong>
          </div>
          <div className="metric-item">
            <span><code>selectPostsGroupedByPlatform</code>:</span>
            <strong className="metric-badge accent-green">{groupedRecomputations}</strong>
          </div>
          <div className="metric-item">
            <span><code>selectAllPosts</code> (Array conversion):</span>
            <strong className="metric-badge accent-green">{allPostsRecomputations}</strong>
          </div>
        </div>
      </div>

      {/* Educational Concept Clarification Box */}
      <div className="concept-clarification-box">
        <h4>🎓 Key Viva Concept: Four Stages of Redux Performance Optimization</h4>
        <div className="stages-row">
          <div className="stage-card">
            <span className="stage-num">1</span>
            <strong>Redux Store Update</strong>
            <p>An action is dispatched; slice reducer computes next state object.</p>
          </div>
          <div className="stage-arrow">→</div>
          <div className="stage-card">
            <span className="stage-num">2</span>
            <strong>Selector Evaluation</strong>
            <p><code>createSelector</code> compares inputs via <code>===</code>. If identical, returns cache!</p>
          </div>
          <div className="stage-arrow">→</div>
          <div className="stage-card">
            <span className="stage-num">3</span>
            <strong>Component Render</strong>
            <p><code>useSelector</code> skips re-render if selector returns same reference.</p>
          </div>
          <div className="stage-arrow">→</div>
          <div className="stage-card">
            <span className="stage-num">4</span>
            <strong>React.memo Child Guard</strong>
            <p><code>PostCard</code> skips rendering if its props have not changed.</p>
          </div>
        </div>
      </div>

      {/* Quick Add Post to Demonstrate True Recomputation */}
      <div className="add-test-post-section">
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-outline btn-sm"
        >
          {showAddForm ? '✕ Close Post Creator' : '+ Add Test Post (Triggers Genuine Recomputation)'}
        </button>

        {showAddForm && (
          <form onSubmit={handleAddPostSubmit} className="inline-add-form">
            <input
              type="text"
              placeholder="Enter test post title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input-field"
              required
            />
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="input-field select-sm"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
            </select>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="input-field select-sm"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">
              Dispatch addPost
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
