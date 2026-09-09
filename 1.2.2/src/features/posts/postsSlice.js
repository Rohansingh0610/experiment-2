import { createSlice } from '@reduxjs/toolkit';

/**
 * Normalized Initial Posts State
 * - byId: Post objects stored by their unique ID (O(1) lookups and updates)
 * - allIds: Ordered array of post IDs
 * 
 * 10 sample posts distributed across 3 platforms and 3 statuses to
 * visibly demonstrate filtering, grouping, and derived statistics.
 */
const initialState = {
  byId: {
    'post-1': {
      id: 'post-1',
      title: 'Announcing Full Stack-II React & Redux Lab',
      platform: 'LinkedIn',
      status: 'Published',
      createdAt: '2026-03-01',
    },
    'post-2': {
      id: 'post-2',
      title: 'Why Reselect & createSelector prevent redundant calculations',
      platform: 'Twitter',
      status: 'Published',
      createdAt: '2026-03-02',
    },
    'post-3': {
      id: 'post-3',
      title: 'Campus Tech Symposium 2026 behind-the-scenes',
      platform: 'Instagram',
      status: 'Published',
      createdAt: '2026-03-03',
    },
    'post-4': {
      id: 'post-4',
      title: 'Drafting the Redux Toolkit 2.x migration guide',
      platform: 'LinkedIn',
      status: 'Draft',
      createdAt: '2026-03-04',
    },
    'post-5': {
      id: 'post-5',
      title: '10 CSS layout tricks you should know in 2026',
      platform: 'Twitter',
      status: 'Draft',
      createdAt: '2026-03-05',
    },
    'post-6': {
      id: 'post-6',
      title: 'Student Project Showcase: UI designs that pop',
      platform: 'Instagram',
      status: 'Draft',
      createdAt: '2026-03-06',
    },
    'post-7': {
      id: 'post-7',
      title: 'Upcoming Workshop: Advanced State Management in React',
      platform: 'LinkedIn',
      status: 'Scheduled',
      createdAt: '2026-03-07',
    },
    'post-8': {
      id: 'post-8',
      title: 'Quick Poll: JavaScript vs TypeScript in College Labs',
      platform: 'Twitter',
      status: 'Scheduled',
      createdAt: '2026-03-08',
    },
    'post-9': {
      id: 'post-9',
      title: 'Photography club winners announcement teaser',
      platform: 'Instagram',
      status: 'Scheduled',
      createdAt: '2026-03-09',
    },
    'post-10': {
      id: 'post-10',
      title: 'Building high-performance frontend data pipelines',
      platform: 'LinkedIn',
      status: 'Published',
      createdAt: '2026-03-10',
    },
  },
  allIds: [
    'post-1',
    'post-2',
    'post-3',
    'post-4',
    'post-5',
    'post-6',
    'post-7',
    'post-8',
    'post-9',
    'post-10',
  ],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action) => {
        const { id, title, platform, status, createdAt } = action.payload;
        state.byId[id] = { id, title, platform, status, createdAt };
        state.allIds.unshift(id);
      },
      prepare: ({ title, platform, status }) => ({
        payload: {
          id: `post-${Date.now()}`,
          title,
          platform,
          status,
          createdAt: new Date().toISOString().split('T')[0],
        },
      }),
    },

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

    deletePost: (state, action) => {
      const idToDelete = action.payload;
      delete state.byId[idToDelete];
      state.allIds = state.allIds.filter((id) => id !== idToDelete);
    },
  },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;
