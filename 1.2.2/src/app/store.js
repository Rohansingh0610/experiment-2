import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice.js';
import filtersReducer from '../features/filters/filtersSlice.js';

/**
 * Centralized Redux Store for Experiment 1.2.2
 * Combines posts (normalized state) and filters (including unrelatedCounter)
 */
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    filters: filtersReducer,
  },
});

export default store;
