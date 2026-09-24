import type { FormEvent } from 'react';
import type { PropertyFilters } from '../types';

interface Props {
  filters: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
  onSubmit: (next?: PropertyFilters) => void;
}

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'commercial', label: 'Commercial' },
];

export default function SearchFilters({ filters, onChange, onSubmit }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(filters);
  }

  return (
    <div>
      <div className="filter-chips" role="tablist" aria-label="Listing type">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`chip${(filters.listingType || 'all') === t.value ? ' active' : ''}`}
            onClick={() => {
              const next = { ...filters, listingType: t.value, page: 1 };
              onChange(next);
              onSubmit(next);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form className="search-panel" onSubmit={handleSubmit}>
        <div className="search-grid">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input
              id="q"
              placeholder="City, address, or keyword"
              value={filters.q || ''}
              onChange={(e) => onChange({ ...filters, q: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="minPrice">Min price</label>
            <input
              id="minPrice"
              type="number"
              min={0}
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="maxPrice">Max price</label>
            <input
              id="maxPrice"
              type="number"
              min={0}
              placeholder="Any"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="bedrooms">Bedrooms</label>
            <select
              id="bedrooms"
              value={filters.bedrooms || ''}
              onChange={(e) => onChange({ ...filters, bedrooms: e.target.value })}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              placeholder="e.g. Austin"
              value={filters.city || ''}
              onChange={(e) => onChange({ ...filters, city: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
