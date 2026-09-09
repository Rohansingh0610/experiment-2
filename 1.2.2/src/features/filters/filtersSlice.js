import { createSlice } from '@reduxjs/toolkit';

/**
 * Filters & Unrelated State Slice
 * - platform: Active platform filter ('ALL', 'Instagram', 'LinkedIn', 'Twitter')
 * - status: Active publication status filter ('ALL', 'Draft', 'Scheduled', 'Published')
 * - unrelatedCounter: An isolated counter in the Redux store used to demonstrate
 *   that dispatching unrelated store updates does NOT trigger recomputations in
 *   memoized post selectors whose input state remained identical.
 */
const initialState = {
  platform: 'ALL',
  status: 'ALL',
  unrelatedCounter: 0,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlatformFilter: (state, action) => {
      state.platform = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.status = action.payload;
    },
    resetFilters: (state) => {
      state.platform = 'ALL';
      state.status = 'ALL';
    },
    incrementUnrelatedCounter: (state) => {
      state.unrelatedCounter += 1;
    },
    decrementUnrelatedCounter: (state) => {
      state.unrelatedCounter -= 1;
    },
  },
});

export const {
  setPlatformFilter,
  setStatusFilter,
  resetFilters,
  incrementUnrelatedCounter,
  decrementUnrelatedCounter,
} = filtersSlice.actions;

export default filtersSlice.reducer;
