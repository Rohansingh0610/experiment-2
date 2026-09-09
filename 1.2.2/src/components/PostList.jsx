import { useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPostsByPlatformAndStatus } from '../features/posts/postsSelectors.js';
import { deletePost } from '../features/posts/postsSlice.js';
import PostCard from './PostCard.jsx';

export default function PostList({ onRenderTrack }) {
  const dispatch = useDispatch();

  // Consume filtered posts derived exclusively from the memoized selector
  const filteredPosts = useSelector(selectPostsByPlatformAndStatus);

  // Track component renders
  const renderCount = useRef(0);
  renderCount.current += 1;

  if (onRenderTrack) {
    onRenderTrack('PostList', renderCount.current);
  }

  // Stable delete callback to preserve PostCard's React.memo optimization
  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id));
    },
    [dispatch]
  );

  return (
    <section className="post-list-section">
      <div className="section-header-row">
        <div>
          <h3>📋 Filtered Posts Collection</h3>
          <p className="section-desc">
            Derived using <code>selectPostsByPlatformAndStatus</code> (Memoized with Reselect).
          </p>
        </div>
        <div className="render-counter-pill">
          PostList Renders: <strong>{renderCount.current}</strong>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card empty-state">
          <p>No posts match the selected platform and status criteria.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
