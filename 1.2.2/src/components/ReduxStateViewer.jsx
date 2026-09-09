import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPostsState,
  selectPostsGroupedByPlatform,
} from '../features/posts/postsSelectors.js';

export default function ReduxStateViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const postsState = useSelector(selectPostsState);
  const filtersState = useSelector((state) => state.filters);
  const groupedPosts = useSelector(selectPostsGroupedByPlatform);

  return (
    <section className="card state-viewer-card">
      <div className="card-header">
        <div>
          <h3>📦 Centralized Redux Store Inspector</h3>
          <p className="section-desc">
            Inspect raw state slices and derived memoized selector outputs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-outline btn-sm"
        >
          {isOpen ? '▲ Hide State Inspector' : '▼ Show State Inspector'}
        </button>
      </div>

      {isOpen && (
        <div className="viewer-grid">
          <div className="viewer-box">
            <div className="viewer-title">
              <strong>Raw Normalized Posts State:</strong> <code>state.posts</code>
            </div>
            <pre className="code-viewer">
              {JSON.stringify(postsState, null, 2)}
            </pre>
          </div>

          <div className="viewer-box">
            <div className="viewer-title">
              <strong>Filters & Unrelated State:</strong> <code>state.filters</code>
            </div>
            <pre className="code-viewer">
              {JSON.stringify(filtersState, null, 2)}
            </pre>
          </div>

          <div className="viewer-box span-full">
            <div className="viewer-title">
              <strong>Derived Memoized Grouping:</strong> <code>selectPostsGroupedByPlatform(state)</code>
            </div>
            <div className="grouped-preview-grid">
              {Object.entries(groupedPosts).map(([platform, postList]) => (
                <div key={platform} className="grouped-col">
                  <h5>{platform} ({postList.length} items)</h5>
                  <ul>
                    {postList.map((p) => (
                      <li key={p.id}>
                        <span className="p-title">{p.title}</span>
                        <span className={`p-status status-${p.status.toLowerCase()}`}>
                          {p.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
