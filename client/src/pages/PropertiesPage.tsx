import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import type { Property, PropertyFilters } from '../types';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';

function fromParams(params: URLSearchParams): PropertyFilters {
  return {
    q: params.get('q') || '',
    listingType: params.get('listingType') || 'all',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    bedrooms: params.get('bedrooms') || '',
    city: params.get('city') || '',
    page: Number(params.get('page') || 1),
  };
}

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>(() => fromParams(searchParams));
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const applyToUrl = useCallback(
    (next: PropertyFilters) => {
      const params = new URLSearchParams();
      if (next.q) params.set('q', next.q);
      if (next.listingType && next.listingType !== 'all') params.set('listingType', next.listingType);
      if (next.minPrice) params.set('minPrice', next.minPrice);
      if (next.maxPrice) params.set('maxPrice', next.maxPrice);
      if (next.bedrooms) params.set('bedrooms', next.bedrooms);
      if (next.city) params.set('city', next.city);
      if (next.page && next.page > 1) params.set('page', String(next.page));
      setSearchParams(params);
    },
    [setSearchParams]
  );

  useEffect(() => {
    setFilters(fromParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const f = fromParams(searchParams);
        const { data } = await api.get('/properties', {
          params: {
            q: f.q || undefined,
            listingType: f.listingType !== 'all' ? f.listingType : undefined,
            minPrice: f.minPrice || undefined,
            maxPrice: f.maxPrice || undefined,
            bedrooms: f.bedrooms || undefined,
            city: f.city || undefined,
            page: f.page || 1,
            limit: 9,
          },
        });
        if (!cancelled) {
          setProperties(data.properties);
          setTotal(data.total);
          setPages(data.pages);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load properties. Please try again.');
          setProperties([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="page-title">
          <p className="eyebrow">Listings</p>
          <h1>Find your next place</h1>
          <p>Search by keyword, filter by listing type, price, and bedrooms.</p>
        </div>

        <div style={{ marginTop: '1.75rem' }}>
          <SearchFilters
            filters={filters}
            onChange={(next) => setFilters(next)}
            onSubmit={(next) => applyToUrl({ ...(next || filters), page: next?.page ?? 1 })}
          />
        </div>

        <div className="results-bar">
          <span>{loading ? 'Searching…' : `${total} result${total === 1 ? '' : 's'}`}</span>
        </div>

        {error && <div className="alert">{error}</div>}

        {loading ? (
          <div className="skeleton-grid">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ) : properties.length === 0 ? (
          <div className="state-block">
            <h3>No matches</h3>
            <p>Try widening your price range or clearing a filter.</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              disabled={(filters.page || 1) <= 1}
              onClick={() => applyToUrl({ ...filters, page: (filters.page || 1) - 1 })}
            >
              Previous
            </button>
            <span style={{ alignSelf: 'center', color: 'var(--muted)' }}>
              Page {filters.page || 1} of {pages}
            </span>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              disabled={(filters.page || 1) >= pages}
              onClick={() => applyToUrl({ ...filters, page: (filters.page || 1) + 1 })}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
