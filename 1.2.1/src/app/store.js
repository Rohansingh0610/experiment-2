import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice.js';
import platformsReducer from '../features/platforms/platformsSlice.js';

/**
 * Centralized Redux Store
 * Combines reducers from feature slices into a single global state object:
 * - state.posts
 * - state.platforms
 */
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
});

export default store;
