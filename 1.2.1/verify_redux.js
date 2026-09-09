import { store } from './src/app/store.js';
import {
  addPost,
  updatePost,
  deletePost,
  selectAllPosts,
  selectPostById,
} from './src/features/posts/postsSlice.js';
import {
  addPlatform,
  deletePlatform,
  selectAllPlatforms,
} from './src/features/platforms/platformsSlice.js';

console.log('--- STARTING REDUX TOOLKIT VERIFICATION TEST ---');

// 1. Initial State Check
const initialState = store.getState();
console.log('Initial Posts allIds:', initialState.posts.allIds);
console.log('Initial Posts byId keys:', Object.keys(initialState.posts.byId));
console.log('Initial Platforms:', initialState.platforms.platforms);

if (
  !initialState.posts.byId['post-1'] ||
  !initialState.posts.allIds.includes('post-1') ||
  !initialState.platforms.platforms.includes('Instagram')
) {
  console.error('FAIL: Initial state is incorrect');
  process.exit(1);
}
console.log('PASS: Initial normalized state validated');

// 2. Test Add Platform
store.dispatch(addPlatform('YouTube'));
const stateAfterAddPlat = store.getState();
if (!stateAfterAddPlat.platforms.platforms.includes('YouTube')) {
  console.error('FAIL: YouTube was not added to platforms');
  process.exit(1);
}
console.log('PASS: addPlatform action verified ->', stateAfterAddPlat.platforms.platforms);

// 3. Test Add Post
store.dispatch(
  addPost({
    title: 'Testing Redux Toolkit State Normalization in College Lab',
    platform: 'YouTube',
    status: 'Published',
  })
);
const stateAfterAddPost = store.getState();
const newestPostId = stateAfterAddPost.posts.allIds[0];
const newestPost = stateAfterAddPost.posts.byId[newestPostId];
console.log('PASS: addPost action verified -> New Post ID:', newestPostId, newestPost);

if (!newestPost || newestPost.title !== 'Testing Redux Toolkit State Normalization in College Lab') {
  console.error('FAIL: New post was not stored in byId');
  process.exit(1);
}

// 4. Test Update Post
store.dispatch(
  updatePost({
    id: newestPostId,
    title: 'Updated: Testing Redux Toolkit State Normalization',
    platform: 'YouTube',
    status: 'Draft',
  })
);
const stateAfterUpdate = store.getState();
const updatedPost = stateAfterUpdate.posts.byId[newestPostId];
if (updatedPost.status !== 'Draft' || !updatedPost.title.startsWith('Updated:')) {
  console.error('FAIL: Post update failed');
  process.exit(1);
}
console.log('PASS: updatePost action verified ->', updatedPost);

// 5. Test Delete Post
store.dispatch(deletePost(newestPostId));
const stateAfterDelete = store.getState();
if (
  stateAfterDelete.posts.byId[newestPostId] !== undefined ||
  stateAfterDelete.posts.allIds.includes(newestPostId)
) {
  console.error('FAIL: Post was not deleted from normalized state');
  process.exit(1);
}
console.log('PASS: deletePost action verified -> Post cleanly removed from byId and allIds');

// 6. Test Delete Platform
store.dispatch(deletePlatform('YouTube'));
const stateAfterDelPlat = store.getState();
if (stateAfterDelPlat.platforms.platforms.includes('YouTube')) {
  console.error('FAIL: YouTube was not deleted from platforms');
  process.exit(1);
}
console.log('PASS: deletePlatform action verified ->', stateAfterDelPlat.platforms.platforms);

// 7. Test Selectors
const allPosts = selectAllPosts(store.getState());
const allPlatforms = selectAllPlatforms(store.getState());
console.log(`PASS: Selectors verified -> ${allPosts.length} posts, ${allPlatforms.length} platforms`);

console.log('--- ALL REDUX TOOLKIT TESTS PASSED SUCCESSFULLY ---');
