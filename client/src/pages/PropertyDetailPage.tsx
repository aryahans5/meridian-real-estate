import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { formatPrice, listingLabel } from '../lib/api';
import type { Property } from '../types';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '10:00',
    message: '',
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (!cancelled) setProperty(data.property);
      } catch {
        if (!cancelled) setError('Property not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleVisit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!user) {
      setFormError('Please sign in to schedule a visit.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/appointments', {
        propertyId: id,
        ...form,
      });
      setFormSuccess('Visit scheduled. We will confirm shortly.');
      setForm((f) => ({ ...f, preferredDate: '', message: '' }));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not schedule visit.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container section">
        <div className="skeleton" style={{ height: 360 }} />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container section state-block">
        <h3>Property unavailable</h3>
        <p>{error || 'This listing could not be loaded.'}</p>
        <Link to="/properties" className="btn btn-outline-dark" style={{ marginTop: '1rem' }}>
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="detail-hero">
        <img src={property.images[0]} alt={property.title} />
        <div className="detail-hero-copy">
          <div className="container">
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>
              {listingLabel(property.listingType)}
            </p>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>{property.title}</h1>
            <p style={{ opacity: 0.85, marginTop: '0.4rem' }}>
              {property.address}, {property.city}, {property.state} {property.zip}
            </p>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>About this property</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '40rem' }}>
            {property.description}
          </p>

          <div className="property-stats" style={{ marginTop: '1.5rem', fontSize: '1rem' }}>
            {property.listingType !== 'commercial' && (
              <>
                <span>{property.bedrooms} bedrooms</span>
                <span>{property.bathrooms} bathrooms</span>
              </>
            )}
            <span>{property.area.toLocaleString()} sqft</span>
            {property.yearBuilt ? <span>Built {property.yearBuilt}</span> : null}
            {typeof property.parking === 'number' ? <span>{property.parking} parking</span> : null}
          </div>

          {property.features?.length > 0 && (
            <>
              <h3 style={{ marginTop: '2rem', fontSize: '1.6rem' }}>Features</h3>
              <div className="feature-list">
                {property.features.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </>
          )}

          {property.images.length > 1 && (
            <div className="detail-gallery">
              {property.images.slice(1).map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          )}
        </div>

        <aside className="visit-panel">
          <h3>Schedule a visit</h3>
          <p className="price">{formatPrice(property.price, property.listingType)}</p>

          {!user && (
            <div className="alert" style={{ marginBottom: '1rem' }}>
              <Link to="/login" style={{ fontWeight: 600 }}>
                Sign in
              </Link>{' '}
              to request a showing.
            </div>
          )}

          <form className="visit-form" onSubmit={handleVisit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="preferredDate">Preferred date</label>
              <input
                id="preferredDate"
                type="date"
                required
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="preferredTime">Preferred time</label>
              <select
                id="preferredTime"
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              >
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Anything we should know?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            {formError && <div className="alert">{formError}</div>}
            {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
            <button type="submit" className="btn btn-primary" disabled={submitting || !user}>
              {submitting ? 'Scheduling…' : 'Request visit'}
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
