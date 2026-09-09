import { createSelector } from '@reduxjs/toolkit';

/**
 * ============================================================================
 * EXPERIMENT 1.2.2: MEMOIZED SELECTORS ARCHITECTURE (RESELECT)
 * ============================================================================
 *
 * 1. INPUT SELECTORS:
 *    Basic, lightweight functions that directly extract raw slices of state
 *    from the global store without any transformation.
 *
 * 2. DERIVED STATE:
 *    Data computed on-the-fly from raw state (e.g., filtered lists, counts,
 *    aggregations) instead of storing redundant data in the Redux store.
 *
 * 3. MEMOIZATION:
 *    `createSelector` wraps a calculation function with an internal cache.
 *    It checks each input selector's return value using strict reference equality (===).
 *    If none of the inputs have changed, it returns the cached result immediately.
 *
 * 4. SELECTOR RECOMPUTATION:
 *    The transform function executes ONLY when at least one input reference changes.
 *    Reselect tracks this via the `.recomputations()` method on each selector.
 * ============================================================================
 */

// --- 1. BASIC INPUT SELECTORS ---
export const selectPostsState = (state) => state.posts;
export const selectPostsById = (state) => state.posts.byId;
export const selectAllPostIds = (state) => state.posts.allIds;

export const selectPlatformFilter = (state) => state.filters.platform;
export const selectStatusFilter = (state) => state.filters.status;
export const selectUnrelatedCounter = (state) => state.filters.unrelatedCounter;

// Memoized selector to turn normalized dictionary into an ordered array
export const selectAllPosts = createSelector(
  [selectPostsById, selectAllPostIds],
  (byId, allIds) => {
    return allIds.map((id) => byId[id]).filter(Boolean);
  }
);

// --- 2. MEMOIZED FILTERED SELECTORS ---

/**
 * selectPostsByPlatform
 * Returns posts filtered by active platform.
 * Recomputes only when `selectAllPosts` or `selectPlatformFilter` changes.
 */
export const selectPostsByPlatform = createSelector(
  [selectAllPosts, selectPlatformFilter],
  (posts, platform) => {
    if (platform === 'ALL') return posts;
    return posts.filter((p) => p.platform === platform);
  }
);

/**
 * selectPostsByStatus
 * Returns posts filtered by publication status.
 * Recomputes only when `selectAllPosts` or `selectStatusFilter` changes.
 */
export const selectPostsByStatus = createSelector(
  [selectAllPosts, selectStatusFilter],
  (posts, status) => {
    if (status === 'ALL') return posts;
    return posts.filter((p) => p.status === status);
  }
);

/**
 * selectPostsByPlatformAndStatus
 * Composes platform and status filters simultaneously.
 * Recomputes ONLY when posts, platform filter, or status filter change.
 * Unrelated state changes (like unrelatedCounter) will NOT recompute this selector!
 */
export const selectPostsByPlatformAndStatus = createSelector(
  [selectAllPosts, selectPlatformFilter, selectStatusFilter],
  (posts, platform, status) => {
    return posts.filter((p) => {
      const matchPlat = platform === 'ALL' || p.platform === platform;
      const matchStat = status === 'ALL' || p.status === status;
      return matchPlat && matchStat;
    });
  }
);

/**
 * selectPublishedPosts
 * Derived selector returning only published posts.
 */
export const selectPublishedPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((p) => p.status === 'Published')
);

// --- 3. MEMOIZED AGGREGATIONS & STATISTICS ---

/**
 * selectPostStatistics
 * Derives statistical counts (total, published, drafts, scheduled, platform counts)
 * directly from the posts collection.
 * Recomputes ONLY when `selectAllPosts` changes reference.
 */
export const selectPostStatistics = createSelector(
  [selectAllPosts],
  (posts) => {
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === 'Published').length,
      draft: posts.filter((p) => p.status === 'Draft').length,
      scheduled: posts.filter((p) => p.status === 'Scheduled').length,
      instagram: posts.filter((p) => p.platform === 'Instagram').length,
      linkedin: posts.filter((p) => p.platform === 'LinkedIn').length,
      twitter: posts.filter((p) => p.platform === 'Twitter').length,
    };
  }
);

/**
 * selectPostsGroupedByPlatform
 * Groups all post items by their platform into a dictionary of arrays.
 * Recomputes ONLY when `selectAllPosts` changes reference.
 */
export const selectPostsGroupedByPlatform = createSelector(
  [selectAllPosts],
  (posts) => {
    return {
      Instagram: posts.filter((p) => p.platform === 'Instagram'),
      LinkedIn: posts.filter((p) => p.platform === 'LinkedIn'),
      Twitter: posts.filter((p) => p.platform === 'Twitter'),
    };
  }
);

/**
 * Helper to inspect genuine Reselect recomputations for the performance monitor
 */
export const getSelectorMetrics = () => ({
  allPostsRecomputations: selectAllPosts.recomputations(),
  filteredRecomputations: selectPostsByPlatformAndStatus.recomputations(),
  statsRecomputations: selectPostStatistics.recomputations(),
  groupedRecomputations: selectPostsGroupedByPlatform.recomputations(),
  publishedRecomputations: selectPublishedPosts.recomputations(),
});
