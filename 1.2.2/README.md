# Experiment 1.2.2: Optimizing State Access Using Memoized Selectors

**Full Stack - II Lab Submission (CONT_24CSP-337)**

---

## 🎯 Aim
To optimize state access and improve application performance using memoized selectors and efficient rendering strategies.

## 📌 Objectives
1. Understand the concept of **derived state** and avoid storing duplicate data in the Redux store.
2. Implement **memoized selectors** using Redux Toolkit's built-in `createSelector` (Reselect).
3. Prevent redundant computations and understand **selector recomputation** cycles.
4. Reduce unnecessary React component re-renders using **`React.memo`**.
5. Identify when **`useMemo`** and **`useCallback`** provide meaningful performance benefits.
6. Build an interactive performance monitor demonstrating cache hits during unrelated Redux state updates.

---

## 🛠️ Technologies Used
- **React.js 19**
- **Vite 8**
- **Redux Toolkit 2.x** (`configureStore`, `createSlice`, `createSelector`)
- **React-Redux 9.x** (`Provider`, `useSelector`, `useDispatch`)
- **Vanilla CSS** (Custom responsive design system with CSS variables)

---

## 🚀 How to Install & Run

1. **Navigate to the Experiment directory**:
   ```bash
   cd "experiment 2/1.2.2"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Run the automated selector test suite**:
   ```bash
   npm test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Lint the code**:
   ```bash
   npm run lint
   ```

---

## 🏗️ Redux Architecture

The application follows a normalized, modular Redux architecture:

```
src/
├── app/
│   └── store.js                      # Centralized configureStore
├── features/
│   ├── posts/
│   │   ├── postsSlice.js             # Normalized posts state ({ byId, allIds })
│   │   └── postsSelectors.js         # Basic & memoized selectors via createSelector
│   └── filters/
│       └── filtersSlice.js           # UI filters & unrelatedCounter state
├── components/
│   ├── PostCard.jsx                  # Memoized with React.memo
│   ├── PostList.jsx                  # Displays filtered posts via selectPostsByPlatformAndStatus
│   ├── Statistics.jsx                # Displays KPIs derived via selectPostStatistics
│   ├── Filters.jsx                   # Dispatches platform and status filter changes
│   ├── PerformanceDemo.jsx           # Live recomputation & render monitoring dashboard
│   └── ReduxStateViewer.jsx          # Real-time state inspector
├── App.jsx                           # Layout, theory notes & grouped overview
├── main.jsx                          # Root React-Redux Provider mount
└── index.css                         # Clean, modern design system
```

---

## 📚 Key Concepts Explained for Lab Viva

### 1. Derived State
**Derived state** is data computed on-the-fly from the existing store rather than saved directly as separate state fields.
- *Example*: Instead of storing `publishedCount` and `draftCount` in the store and manually updating them on every CRUD operation, we store only the normalized posts and compute statistics dynamically using selectors. This guarantees zero state synchronization bugs.

### 2. Memoized Selectors (`createSelector`)
Selectors created with Redux Toolkit's `createSelector` (from Reselect) wrap computation functions with an internal cache.
- **Input Selectors**: Extract raw state values (e.g. `selectAllPosts`, `selectPlatformFilter`).
- **Transform Function**: Computes the derived output (e.g. filtered array or metrics object).
- **Cache Check**: `createSelector` checks if all input arguments match their previous values using strict reference equality (`===`).
  - **Cache Hit**: If inputs are identical, the transform function is **skipped**, and the previously cached result reference is returned immediately.
  - **Recomputation**: If any input reference changes, the transform function runs, and the internal `.recomputations()` counter increments.

### 3. Selector Recomputations
Reselect provides a `.recomputations()` method on every selector. In this experiment:
- When you click the **Unrelated Counter `[+]`** in the dashboard, `state.filters.unrelatedCounter` changes in the Redux store.
- However, because `state.posts` and filter values did not change, `selectPostStatistics.recomputations()` and `selectPostsByPlatformAndStatus.recomputations()` **do not increment**.

### 4. `React.memo`
`React.memo` is a higher-order component that wraps child components (such as [`PostCard.jsx`](file:///Users/rohan/VS%20code/experiment%202/1.2.2/src/components/PostCard.jsx)).
- When parent components re-render, `React.memo` compares current and previous props via shallow equality (`===`).
- If props (`post`, `onDelete`) have not changed, `PostCard` skips re-rendering entirely.

### 5. `useMemo` & `useCallback`
- **`useCallback`**: Used in `PostList.jsx` for the `handleDelete` action to ensure child `PostCard` components receive stable function references across renders, preventing broken `React.memo` optimizations.
- **`useMemo`**: Reserved for expensive in-component calculations where Redux selectors are not applicable. It should NOT be blindly added everywhere.

---

## 🔄 Four-Stage Optimization Pipeline

```
[Redux Store Update]
        │
        ▼
[Input Selectors Checked] (Strict === equality check)
        │
        ├── Changed ──► [Selector Recomputes] (recomputations++ -> new reference returned)
        │
        └── Unchanged ─► [Cache Hit (Memoized)] (recomputations unchanged -> cached reference returned)
                                │
                                ▼
                    [useSelector Check] (Compares returned reference)
                                │
                                ├── Changed ──► [Component Re-renders]
                                │
                                └── Unchanged ─► [Component Re-render SKIPPED]
                                                        │
                                                        ▼
                                             [React.memo Child Guard]
                                             (Skips child card renders)
```

---

## 🧪 Verification & Expected Outcome

All 9 automated test suites pass cleanly:
```bash
npm test
```
```
====================================================
EXPERIMENT 1.2.2: RESELECT MEMOIZATION TEST SUITE
====================================================
[1/8] Testing Basic Input Selectors...                   ✓ PASS
[2/8] Testing Platform and Status Selectors...          ✓ PASS
[3/8] Testing Combined Filtering...                     ✓ PASS
[4/8] Testing Derived Statistics...                     ✓ PASS
[5/8] Testing Grouped Posts by Platform...              ✓ PASS
[6/8] Testing selectPublishedPosts...                   ✓ PASS
[7/8] Testing Reference Stability (Cache Hit)...        ✓ PASS
[8/8] Testing Unrelated State & Recomputation Guard...   ✓ PASS
[9/9] Testing Recomputation on Actual Post Change...    ✓ PASS
====================================================
ALL 9 EXPERIMENT 1.2.2 TEST SUITES PASSED SUCCESSFULLY!
====================================================
```

### Expected Outcome:
- Efficient, optimized state access using composable Reselect selectors.
- Zero redundant calculations when unrelated Redux state updates.
- Reduced component re-renders through stable selector references and `React.memo`.
- Fully documented, beginner-friendly architecture ready for college lab evaluation.
