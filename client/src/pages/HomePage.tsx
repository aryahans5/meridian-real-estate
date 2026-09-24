import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { Property } from '../types';
import PropertyCard from '../components/PropertyCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await api.get('/properties', { params: { limit: 6 } });
        if (!cancelled) setFeatured(data.properties);
      } catch {
        if (!cancelled) setFeatured([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt=""
          />
        </div>
        <div className="hero-content">
          <p className="hero-brand">Meridian</p>
          <p className="hero-line">
            Premium homes and commercial spaces, curated for how you actually want to live and work.
          </p>
          <div className="hero-actions">
            <Link to="/properties" className="btn btn-gold">
              Explore listings
            </Link>
            <Link to="/properties?listingType=rent" className="btn btn-outline">
              Browse rentals
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured</p>
              <h2>Homes worth a second look</h2>
            </div>
            <p>A rotating selection of residences and workspaces available across Meridian markets.</p>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ) : featured.length === 0 ? (
            <div className="state-block">
              <h3>No listings yet</h3>
              <p>Check back soon — new properties are added regularly.</p>
            </div>
          ) : (
            <div className="property-grid">
              {featured.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link to="/properties" className="btn btn-outline-dark">
              View all properties
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial">
        <div className="container">
          <div>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>
              Why Meridian
            </p>
            <h2>Search with clarity. Visit with confidence.</h2>
            <p>
              Filter by buy, rent, or commercial — then refine by price and bedrooms. When a home feels right, schedule a visit in a few clicks.
            </p>
            <Link to="/register" className="btn btn-gold">
              Create an account
            </Link>
          </div>
          <div className="editorial-stat">
            12+
            <span>Curated markets</span>
          </div>
        </div>
      </section>
    </>
  );
}
