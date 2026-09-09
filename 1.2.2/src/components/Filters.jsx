import { useSelector, useDispatch } from 'react-redux';
import {
  selectPlatformFilter,
  selectStatusFilter,
} from '../features/posts/postsSelectors.js';
import {
  setPlatformFilter,
  setStatusFilter,
  resetFilters,
} from '../features/filters/filtersSlice.js';

export default function Filters() {
  const dispatch = useDispatch();
  const currentPlatform = useSelector(selectPlatformFilter);
  const currentStatus = useSelector(selectStatusFilter);

  const platforms = ['ALL', 'LinkedIn', 'Twitter', 'Instagram'];
  const statuses = ['ALL', 'Draft', 'Scheduled', 'Published'];

  return (
    <section className="card filters-card">
      <div className="card-header">
        <div>
          <h3>🔍 Filter Controls</h3>
          <p className="section-desc">
            Changes stored filter state, causing memoized selectors to evaluate only when filter inputs actually change.
          </p>
        </div>
        {(currentPlatform !== 'ALL' || currentStatus !== 'ALL') && (
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="btn btn-outline btn-sm"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="filter-controls-grid">
        <div className="filter-group">
          <label className="filter-group-label">Platform Filter:</label>
          <div className="filter-btn-group">
            {platforms.map((plat) => (
              <button
                key={plat}
                type="button"
                className={`btn-filter ${currentPlatform === plat ? 'active' : ''}`}
                onClick={() => dispatch(setPlatformFilter(plat))}
              >
                {plat === 'ALL' ? 'All Platforms' : plat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Status Filter:</label>
          <div className="filter-btn-group">
            {statuses.map((stat) => (
              <button
                key={stat}
                type="button"
                className={`btn-filter ${currentStatus === stat ? 'active' : ''}`}
                onClick={() => dispatch(setStatusFilter(stat))}
              >
                {stat === 'ALL' ? 'All Statuses' : stat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
