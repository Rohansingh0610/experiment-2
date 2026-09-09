import React, { useRef } from 'react';

/**
 * PostCard Component
 * Optimized with React.memo to prevent unnecessary child component re-renders
 * when the parent re-renders due to unrelated state updates.
 */
function PostCard({ post, onDelete }) {
  // Track actual render count of this specific card
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="card post-card">
      <div className="post-card-top">
        <span className={`platform-badge platform-${post.platform.toLowerCase()}`}>
          {post.platform}
        </span>
        <span className={`status-pill status-${post.status.toLowerCase()}`}>
          {post.status}
        </span>
      </div>

      <h4 className="post-title">{post.title}</h4>

      <div className="post-card-bottom">
        <div className="post-meta">
          <span className="post-date">📅 {post.createdAt}</span>
          <span className="card-render-badge" title="Number of times this PostCard component rendered">
            Renders: {renderCount.current}
          </span>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="btn-delete-sm"
            title="Delete post"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// Wrap with React.memo: component will only re-render if post or onDelete reference changes
export default React.memo(PostCard);
