import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
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

function toSearchPath(filters: PropertyFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.listingType && filters.listingType !== 'all') {
    params.set('listingType', filters.listingType);
  }
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
  if (filters.city) params.set('city', filters.city);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : '/properties';
}

export default function SearchFilters({ filters, onChange, onSubmit }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(filters);
  }

  return (
    <div>
      <div className="filter-chips" role="tablist" aria-label="Listing type">
        {TYPES.map((t) => {
          const next = { ...filters, listingType: t.value, page: 1 };
          const active = (filters.listingType || 'all') === t.value;
          return (
            <Link
              key={t.value}
              to={toSearchPath(next)}
              role="tab"
              aria-selected={active}
              className={`chip${active ? ' active' : ''}`}
              onClick={() => onChange(next)}
            >
              {t.label}
            </Link>
          );
        })}
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
