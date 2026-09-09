import { createSlice } from '@reduxjs/toolkit';

/**
 * Posts Feature Slice with State Normalization
 * 
 * Normalization Concept:
 * - byId: A dictionary of post objects keyed by their unique IDs (O(1) lookups and updates)
 * - allIds: An ordered array of all post IDs (maintains listing order)
 * 
 * This mimics standard database indexing and eliminates duplicate records,
 * in line with Redux Toolkit best practices.
 */
const initialState = {
  byId: {
    'post-1': {
      id: 'post-1',
      title: 'Building Modern Web Applications with React 19 & Redux Toolkit',
      platform: 'LinkedIn',
      status: 'Published',
      createdAt: '2026-03-01',
    },
    'post-2': {
      id: 'post-2',
      title: 'Top 5 Advantages of Centralized State Management in Full Stack Apps',
      platform: 'Twitter',
      status: 'Draft',
      createdAt: '2026-03-03',
    },
    'post-3': {
      id: 'post-3',
      title: 'Campus Hackathon 2026 Behind the Scenes Highlights',
      platform: 'Instagram',
      status: 'Scheduled',
      createdAt: '2026-03-05',
    },
  },
  allIds: ['post-1', 'post-2', 'post-3'],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // CRUD: Add a new post
    addPost: {
      reducer: (state, action) => {
        const { id, title, platform, status, createdAt } = action.payload;
        // Insert into normalized dictionary
        state.byId[id] = { id, title, platform, status, createdAt };
        // Prepend ID to maintain newest-first order
        state.allIds.unshift(id);
      },
      prepare: ({ title, platform, status }) => {
        // Prepare callback to generate unique ID and timestamp before reducer execution
        return {
          payload: {
            id: `post-${Date.now()}`,
            title,
            platform,
            status,
            createdAt: new Date().toISOString().split('T')[0],
          },
        };
      },
    },

    // CRUD: Update an existing post
    updatePost: (state, action) => {
      const { id, title, platform, status } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = {
          ...state.byId[id],
          title,
          platform,
          status,
        };
      }
    },

    // CRUD: Delete a post
    deletePost: (state, action) => {
      const idToDelete = action.payload;
      // Remove entity from dictionary
      delete state.byId[idToDelete];
      // Remove ID from the ordered list
      state.allIds = state.allIds.filter((id) => id !== idToDelete);
    },
  },
});

// Export action creators
export const { addPost, updatePost, deletePost } = postsSlice.actions;

// Selectors
// Selector to retrieve all post objects as an ordered array
export const selectAllPosts = (state) =>
  state.posts.allIds.map((id) => state.posts.byId[id]).filter(Boolean);

// Selector to get a specific post by ID
export const selectPostById = (state, postId) => state.posts.byId[postId];

// Selectors for inspecting normalized state directly
export const selectPostsByIdMap = (state) => state.posts.byId;
export const selectPostsAllIds = (state) => state.posts.allIds;

export default postsSlice.reducer;
