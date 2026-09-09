import { store } from './src/app/store.js';
import {
  selectPostsState,
  selectPostsById,
  selectAllPostIds,
  selectAllPosts,
  selectPlatformFilter,
  selectStatusFilter,
  selectUnrelatedCounter,
  selectPostsByPlatform,
  selectPostsByStatus,
  selectPostsByPlatformAndStatus,
  selectPostStatistics,
  selectPostsGroupedByPlatform,
  selectPublishedPosts,
} from './src/features/posts/postsSelectors.js';
import {
  setPlatformFilter,
  setStatusFilter,
  resetFilters,
  incrementUnrelatedCounter,
} from './src/features/filters/filtersSlice.js';
import { addPost, deletePost } from './src/features/posts/postsSlice.js';

console.log('====================================================');
console.log('EXPERIMENT 1.2.2: RESELECT MEMOIZATION TEST SUITE');
console.log('====================================================\n');

// TEST 1: Basic Selectors
console.log('[1/8] Testing Basic Input Selectors...');
const state = store.getState();
const postsState = selectPostsState(state);
const postsById = selectPostsById(state);
const allPostIds = selectAllPostIds(state);
const allPosts = selectAllPosts(state);
const platFilter = selectPlatformFilter(state);
const statFilter = selectStatusFilter(state);
const unrelatedCounter = selectUnrelatedCounter(state);

if (!postsState || !postsById || allPostIds.length !== 10 || allPosts.length !== 10) {
  console.error('FAIL: Basic posts selectors returned invalid data');
  process.exit(1);
}
if (platFilter !== 'ALL' || statFilter !== 'ALL' || unrelatedCounter !== 0) {
  console.error('FAIL: Basic filter selectors returned unexpected default state');
  process.exit(1);
}
console.log('✓ PASS: All basic input selectors return correct state structures.');

// TEST 2: Filtered Selectors by Platform and Status
console.log('\n[2/8] Testing selectPostsByPlatform and selectPostsByStatus...');
store.dispatch(setPlatformFilter('LinkedIn'));
const linkedInPosts = selectPostsByPlatform(store.getState());
if (linkedInPosts.length !== 4 || linkedInPosts.some((p) => p.platform !== 'LinkedIn')) {
  console.error('FAIL: selectPostsByPlatform failed for LinkedIn');
  process.exit(1);
}

store.dispatch(setStatusFilter('Draft'));
const draftPosts = selectPostsByStatus(store.getState());
if (draftPosts.length !== 3 || draftPosts.some((p) => p.status !== 'Draft')) {
  console.error('FAIL: selectPostsByStatus failed for Draft');
  process.exit(1);
}
console.log(`✓ PASS: Platform filtering (${linkedInPosts.length} LinkedIn) and Status filtering (${draftPosts.length} Drafts) verified.`);

// TEST 3: Combined Platform + Status Filtering
console.log('\n[3/8] Testing selectPostsByPlatformAndStatus (Combined Filtering)...');
// Filters currently: LinkedIn + Draft
const linkedInDrafts = selectPostsByPlatformAndStatus(store.getState());
if (linkedInDrafts.length !== 1 || linkedInDrafts[0].id !== 'post-4') {
  console.error('FAIL: Combined filtering (LinkedIn + Draft) should return 1 post (post-4)');
  process.exit(1);
}

// Reset filters
store.dispatch(resetFilters());
const allAfterReset = selectPostsByPlatformAndStatus(store.getState());
if (allAfterReset.length !== 10) {
  console.error('FAIL: Reset filters should return all 10 posts');
  process.exit(1);
}
console.log('✓ PASS: Combined filtering correctly evaluated combinations and resets.');

// TEST 4: Derived Statistics
console.log('\n[4/8] Testing selectPostStatistics (Derived State)...');
const stats = selectPostStatistics(store.getState());
if (
  stats.total !== 10 ||
  stats.published !== 4 ||
  stats.draft !== 3 ||
  stats.scheduled !== 3 ||
  stats.linkedin !== 4 ||
  stats.twitter !== 3 ||
  stats.instagram !== 3
) {
  console.error('FAIL: selectPostStatistics returned incorrect metrics', stats);
  process.exit(1);
}
console.log('✓ PASS: Derived statistics: 10 Total (4 Published, 3 Draft, 3 Scheduled) correctly calculated.');

// TEST 5: Grouped Posts by Platform
console.log('\n[5/8] Testing selectPostsGroupedByPlatform...');
const grouped = selectPostsGroupedByPlatform(store.getState());
if (
  grouped.LinkedIn.length !== 4 ||
  grouped.Twitter.length !== 3 ||
  grouped.Instagram.length !== 3
) {
  console.error('FAIL: selectPostsGroupedByPlatform returned incorrect group sizes', grouped);
  process.exit(1);
}
console.log('✓ PASS: Grouped data: LinkedIn(4), Twitter(3), Instagram(3) verified.');

// TEST 6: selectPublishedPosts
console.log('\n[6/8] Testing selectPublishedPosts...');
const publishedOnly = selectPublishedPosts(store.getState());
if (publishedOnly.length !== 4 || publishedOnly.some((p) => p.status !== 'Published')) {
  console.error('FAIL: selectPublishedPosts returned non-published items', publishedOnly);
  process.exit(1);
}
console.log('✓ PASS: selectPublishedPosts verified (4 published posts).');

// TEST 7: Memoization Reference Equality (Cache Hit)
console.log('\n[7/8] Testing Reference Stability (Cache Hit without store change)...');
const statsCall1 = selectPostStatistics(store.getState());
const statsCall2 = selectPostStatistics(store.getState());
if (statsCall1 !== statsCall2) {
  console.error('FAIL: Reselect should return identical object reference on successive calls with same state');
  process.exit(1);
}
console.log('✓ PASS: Exact reference equality preserved across consecutive calls (Cache Hit).');

// TEST 8: CRITICAL PERFORMANCE TEST - Unrelated State Changes
console.log('\n[8/8] CRITICAL TEST: Unrelated State Updates & Recomputation Invariance...');

// Capture current recomputation counters before unrelated update
const statsRecompBefore = selectPostStatistics.recomputations();
const filterRecompBefore = selectPostsByPlatformAndStatus.recomputations();
const groupRecompBefore = selectPostsGroupedByPlatform.recomputations();

// Store previous output references
const prevStatsRef = selectPostStatistics(store.getState());
const prevFilterRef = selectPostsByPlatformAndStatus(store.getState());
const prevGroupRef = selectPostsGroupedByPlatform(store.getState());

console.log(`Initial recomputations -> Stats: ${statsRecompBefore}, Filter: ${filterRecompBefore}, Group: ${groupRecompBefore}`);

// Dispatch 5 unrelated state updates to store.filters.unrelatedCounter
console.log('Dispatching 5 unrelated store updates (incrementUnrelatedCounter)...');
store.dispatch(incrementUnrelatedCounter());
store.dispatch(incrementUnrelatedCounter());
store.dispatch(incrementUnrelatedCounter());
store.dispatch(incrementUnrelatedCounter());
store.dispatch(incrementUnrelatedCounter());

const stateAfterUnrelated = store.getState();
if (stateAfterUnrelated.filters.unrelatedCounter !== 5) {
  console.error('FAIL: unrelatedCounter was not updated in Redux store');
  process.exit(1);
}

// Evaluate selectors again on the updated global state
const newStatsRef = selectPostStatistics(stateAfterUnrelated);
const newFilterRef = selectPostsByPlatformAndStatus(stateAfterUnrelated);
const newGroupRef = selectPostsGroupedByPlatform(stateAfterUnrelated);

const statsRecompAfter = selectPostStatistics.recomputations();
const filterRecompAfter = selectPostsByPlatformAndStatus.recomputations();
const groupRecompAfter = selectPostsGroupedByPlatform.recomputations();

console.log(`Recomputations after 5 unrelated updates -> Stats: ${statsRecompAfter}, Filter: ${filterRecompAfter}, Group: ${groupRecompAfter}`);

// Assert recomputations did NOT increment
if (statsRecompAfter !== statsRecompBefore) {
  console.error(`FAIL: selectPostStatistics recomputed unnecessarily! Before: ${statsRecompBefore}, After: ${statsRecompAfter}`);
  process.exit(1);
}
if (filterRecompAfter !== filterRecompBefore) {
  console.error(`FAIL: selectPostsByPlatformAndStatus recomputed unnecessarily! Before: ${filterRecompBefore}, After: ${filterRecompAfter}`);
  process.exit(1);
}
if (groupRecompAfter !== groupRecompBefore) {
  console.error(`FAIL: selectPostsGroupedByPlatform recomputed unnecessarily! Before: ${groupRecompBefore}, After: ${groupRecompAfter}`);
  process.exit(1);
}

// Assert exact reference equality was preserved
if (newStatsRef !== prevStatsRef || newFilterRef !== prevFilterRef || newGroupRef !== prevGroupRef) {
  console.error('FAIL: Cached references were broken despite identical selector inputs!');
  process.exit(1);
}

console.log('✓ PASS: Zero recomputations on unrelated store updates!');
console.log('✓ PASS: Cached references 100% preserved. Components will NOT re-render!');

// TEST 9: Contrast Test - Genuine Recomputation when Posts ACTUALLY Change
console.log('\n[9/9] Testing Recomputation Trigger on Actual Post State Change (addPost)...');
const recompBeforePostAdd = selectPostStatistics.recomputations();
store.dispatch(
  addPost({
    title: 'New Post to verify genuine recomputation trigger',
    platform: 'Instagram',
    status: 'Published',
  })
);
// In Redux, selectors evaluate on-demand when called:
const newStatsAfterAdd = selectPostStatistics(store.getState());
const recompAfterPostAdd = selectPostStatistics.recomputations();
if (recompAfterPostAdd !== recompBeforePostAdd + 1 || newStatsAfterAdd.total !== 11) {
  console.error(`FAIL: selectPostStatistics should increment recomputation count on new post! Before: ${recompBeforePostAdd}, After: ${recompAfterPostAdd}`);
  process.exit(1);
}
console.log(`✓ PASS: selectPostStatistics correctly recomputed when posts state changed (${recompBeforePostAdd} -> ${recompAfterPostAdd}, total posts: ${newStatsAfterAdd.total}).`);

// Clean up test post
const addedPostId = store.getState().posts.allIds[0];
store.dispatch(deletePost(addedPostId));
console.log('✓ PASS: deletePost executed and state cleaned up.');

console.log('\n====================================================');
console.log('ALL 9 EXPERIMENT 1.2.2 TEST SUITES PASSED SUCCESSFULLY!');
console.log('====================================================');

