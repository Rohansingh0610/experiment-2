import { createSlice } from '@reduxjs/toolkit';

/**
 * Platforms Feature Slice
 * Manages the global list of active social platforms.
 * Redux Toolkit's createSlice automatically generates action creators
 * and action types corresponding to the reducers.
 */
const initialState = {
  platforms: ['Instagram', 'LinkedIn', 'Twitter'],
};

export const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    // Action to add a new platform (prevents duplicates)
    addPlatform: (state, action) => {
      const trimmedName = action.payload?.trim();
      if (!trimmedName) return;

      const alreadyExists = state.platforms.some(
        (p) => p.toLowerCase() === trimmedName.toLowerCase()
      );

      if (!alreadyExists) {
        state.platforms.push(trimmedName);
      }
    },

    // Action to delete a platform by name
    deletePlatform: (state, action) => {
      const platformToDelete = action.payload;
      state.platforms = state.platforms.filter((p) => p !== platformToDelete);
    },
  },
});

// Export auto-generated action creators
export const { addPlatform, deletePlatform } = platformsSlice.actions;

// Selectors
export const selectAllPlatforms = (state) => state.platforms.platforms;

// Export the reducer for store configuration
export default platformsSlice.reducer;
