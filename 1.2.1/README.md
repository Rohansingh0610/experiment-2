# Experiment 1.2.1: Centralized State Management Using Redux Toolkit

**Full Stack - II Lab Submission (CONT_24CSP-337)**

## Aim
Design and implement a centralized state management system using Redux Toolkit for managing posts and platform-related data.

## Features
- **Centralized Redux Store**: Configured with `configureStore` combining `posts` and `platforms` reducers.
- **State Normalization**: `postsSlice` uses normalized state structure (`byId` dictionary + `allIds` array) for optimal $O(1)$ lookups and predictable mutations.
- **Post CRUD Operations**: Add, update, and delete posts dispatched directly to Redux store.
- **Platforms Management**: Dynamic addition and deletion of platforms stored in `state.platforms.platforms`.
- **Filtering & Search**: Live filtering by platform, status (`Draft`, `Scheduled`, `Published`), and headline text search.
- **Live Redux Store Inspector**: Built-in inspector UI displaying real-time JSON snapshots of the normalized state.

## Project Structure
```
1.2.1/
├── src/
│   ├── app/
│   │   └── store.js                      # Redux store configuration
│   ├── features/
│   │   ├── posts/
│   │   │   └── postsSlice.js             # Normalized posts slice & CRUD reducers
│   │   └── platforms/
│   │       └── platformsSlice.js         # Platforms slice & actions
│   ├── components/
│   │   └── PostManager.jsx               # Posts CRUD, platform tags & filters
│   ├── App.jsx                           # Lab layout, metrics ribbon & Redux data flow
│   ├── main.jsx                          # Redux Provider entry point
│   └── index.css                         # Modern responsive CSS design system
├── public/                               # Static assets (favicons, icons)
├── verify_redux.js                       # Automated Redux test suite
├── index.html                            # HTML entry point
├── package.json                          # Dependencies & scripts
└── vite.config.js                        # Vite configuration
```

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Run Redux verification tests**:
   ```bash
   npm test
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Lint check**:
   ```bash
   npm run lint
   ```
