import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllPosts,
  addPost,
  updatePost,
  deletePost,
} from '../features/posts/postsSlice';
import {
  selectAllPlatforms,
  addPlatform,
  deletePlatform,
} from '../features/platforms/platformsSlice';

export default function PostManager() {
  const dispatch = useDispatch();

  // 1. Reading application data directly from the centralized Redux store
  const posts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);
  const rawPostsState = useSelector((state) => state.posts);
  const rawPlatformsState = useSelector((state) => state.platforms);

  // 2. Local state is restricted ONLY to transient form inputs and filter criteria
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(platforms[0] || 'LinkedIn');
  const [status, setStatus] = useState('Draft');
  const [editingId, setEditingId] = useState(null);

  // Platform creation input
  const [newPlatformName, setNewPlatformName] = useState('');

  // Filtering criteria (Platform & Status)
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inspector toggle
  const [showInspector, setShowInspector] = useState(true);

  // Form submission handler: dispatches addPost or updatePost
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      // Dispatch action to update an existing post in the store
      dispatch(
        updatePost({
          id: editingId,
          title: title.trim(),
          platform,
          status,
        })
      );
      setEditingId(null);
    } else {
      // Dispatch action to add a new post to the store
      dispatch(
        addPost({
          title: title.trim(),
          platform: platform || (platforms[0] || 'General'),
          status,
        })
      );
    }

    // Reset form inputs
    setTitle('');
    setStatus('Draft');
    if (platforms.length > 0) {
      setPlatform(platforms[0]);
    }
  };

  // Populate form for editing
  const handleStartEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setPlatform(post.platform);
    setStatus(post.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setStatus('Draft');
    if (platforms.length > 0) {
      setPlatform(platforms[0]);
    }
  };

  // Delete post handler
  const handleDeletePost = (id) => {
    dispatch(deletePost(id));
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  // Platform creation handler
  const handleAddPlatform = (e) => {
    e.preventDefault();
    if (!newPlatformName.trim()) return;
    dispatch(addPlatform(newPlatformName.trim()));
    setNewPlatformName('');
  };

  // Platform deletion handler
  const handleDeletePlatform = (platName) => {
    dispatch(deletePlatform(platName));
    if (platform === platName) {
      const remaining = platforms.filter((p) => p !== platName);
      setPlatform(remaining[0] || '');
    }
    if (platformFilter === platName) {
      setPlatformFilter('ALL');
    }
  };

  // Filter posts based on current filter states
  const filteredPosts = posts.filter((post) => {
    const matchesPlatform =
      platformFilter === 'ALL' || post.platform === platformFilter;
    const matchesStatus =
      statusFilter === 'ALL' || post.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  return (
    <div className="post-manager">
      {/* SECTION 1: Top Dashboard Grid (Forms & Controls) */}
      <div className="dashboard-grid">
        {/* Card A: Create / Update Post Form */}
        <section className="card post-form-card">
          <div className="card-header">
            <h3>{editingId ? '✏️ Edit Post' : '📝 Create New Post'}</h3>
            {editingId && (
              <span className="editing-badge">Editing: #{editingId}</span>
            )}
          </div>

          <form onSubmit={handlePostSubmit} className="form-stack">
            <div className="form-group">
              <label htmlFor="post-title">Post Title / Content</label>
              <input
                id="post-title"
                type="text"
                placeholder="Enter post title or headline..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="post-platform">Target Platform</label>
                <select
                  id="post-platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="input-field"
                  disabled={platforms.length === 0}
                >
                  {platforms.length === 0 ? (
                    <option value="">No platforms available</option>
                  ) : (
                    platforms.map((plat) => (
                      <option key={plat} value={plat}>
                        {plat}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="post-status">Publication Status</label>
                <select
                  id="post-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={platforms.length === 0}
              >
                {editingId ? 'Save Changes' : '+ Add Post'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Card B: Platform Management */}
        <section className="card platform-card">
          <div className="card-header">
            <h3>🌐 Platforms Manager</h3>
            <span className="count-pill">{platforms.length} active</span>
          </div>

          <p className="section-desc">
            Platforms stored in Redux <code>state.platforms.platforms</code>.
          </p>

          <div className="platform-tags">
            {platforms.length === 0 ? (
              <span className="empty-text">No platforms available. Add one below.</span>
            ) : (
              platforms.map((plat) => (
                <span key={plat} className="platform-chip">
                  <span className="platform-name">{plat}</span>
                  <button
                    type="button"
                    title={`Delete ${plat}`}
                    onClick={() => handleDeletePlatform(plat)}
                    className="chip-delete-btn"
                    aria-label={`Delete ${plat}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <form onSubmit={handleAddPlatform} className="add-platform-form">
            <input
              type="text"
              placeholder="e.g. YouTube, Threads"
              value={newPlatformName}
              onChange={(e) => setNewPlatformName(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn btn-outline">
              + Add Platform
            </button>
          </form>
        </section>
      </div>

      {/* SECTION 2: Filters & Search Controls */}
      <section className="card filter-card">
        <div className="filter-header">
          <h3>🔍 Filter & Search Posts</h3>
          <span className="results-count">
            Showing {filteredPosts.length} of {posts.length} posts
          </span>
        </div>

        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="search-input">Search Title</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="filter-platform">Filter by Platform</label>
            <select
              id="filter-platform"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Platforms ({platforms.length})</option>
              {platforms.map((plat) => (
                <option key={plat} value={plat}>
                  {plat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-status">Filter by Status</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {(platformFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery !== '') && (
            <div className="filter-item reset-col">
              <label>&nbsp;</label>
              <button
                type="button"
                onClick={() => {
                  setPlatformFilter('ALL');
                  setStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-link"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Posts List / Grid */}
      <section className="posts-section">
        <div className="section-title-row">
          <h3>📋 All Posts in Redux Store</h3>
          <span className="badge-count">Total: {posts.length}</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="card empty-state">
            <p>No posts match the current filter or search criteria.</p>
            {posts.length === 0 && (
              <p className="subtext">Use the form above to add your first post!</p>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`card post-card ${editingId === post.id ? 'is-editing' : ''}`}
              >
                <div className="post-meta-top">
                  <span className={`platform-badge platform-${post.platform.toLowerCase()}`}>
                    {post.platform}
                  </span>
                  <span className={`status-pill status-${post.status.toLowerCase()}`}>
                    {post.status}
                  </span>
                </div>

                <h4 className="post-title">{post.title}</h4>

                <div className="post-footer">
                  <span className="post-id">ID: {post.id}</span>
                  <div className="card-actions">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(post)}
                      className="btn-action btn-edit"
                      title="Edit this post"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="btn-action btn-delete"
                      title="Delete this post from Redux store"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: Live Redux Normalized State Inspector */}
      <section className="card state-inspector-card">
        <div className="card-header inspector-header">
          <div>
            <h3>⚡ Live Redux Store Inspector</h3>
            <p className="section-desc">
              Real-time snapshot directly from <code>useSelector((state) =&gt; state)</code> proving state normalization.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className="btn btn-outline btn-sm"
          >
            {showInspector ? 'Hide Inspector' : 'Show Inspector'}
          </button>
        </div>

        {showInspector && (
          <div className="inspector-content">
            <div className="inspector-box">
              <div className="inspector-title">
                <strong>Normalized Posts State:</strong> <code>state.posts</code> (
                <code>byId</code> dictionary + <code>allIds</code> index array)
              </div>
              <pre className="code-block">
                {JSON.stringify(rawPostsState, null, 2)}
              </pre>
            </div>

            <div className="inspector-box">
              <div className="inspector-title">
                <strong>Platforms State:</strong> <code>state.platforms</code> (
                <code>platforms</code> array)
              </div>
              <pre className="code-block">
                {JSON.stringify(rawPlatformsState, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
