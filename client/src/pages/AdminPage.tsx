import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import api, { formatPrice, listingLabel } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Appointment, Property } from '../types';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  listingType: 'buy',
  bedrooms: '3',
  bathrooms: '2',
  area: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  images: '',
  features: '',
  status: 'available',
  yearBuilt: '',
  parking: '0',
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<'properties' | 'appointments' | 'form'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadProperties = useCallback(async () => {
    const { data } = await api.get('/properties', { params: { limit: 50, status: 'all' } });
    setProperties(data.properties);
  }, []);

  const loadAppointments = useCallback(async () => {
    const { data } = await api.get('/appointments');
    setAppointments(data.appointments);
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    loadProperties().catch(() => setError('Failed to load properties'));
    loadAppointments().catch(() => setError('Failed to load appointments'));
  }, [user, loadProperties, loadAppointments]);

  if (authLoading) {
    return <div className="container section state-block">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="container section state-block">
        <h3>Admin only</h3>
        <p>You do not have permission to view this dashboard.</p>
      </div>
    );
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
    setError('');
    setTab('form');
  }

  function startEdit(property: Property) {
    setEditingId(property._id);
    setForm({
      title: property.title,
      description: property.description,
      price: String(property.price),
      listingType: property.listingType,
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      area: String(property.area),
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      images: property.images.join('\n'),
      features: property.features.join(', '),
      status: property.status,
      yearBuilt: property.yearBuilt ? String(property.yearBuilt) : '',
      parking: String(property.parking ?? 0),
    });
    setMessage('');
    setError('');
    setTab('form');
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      listingType: form.listingType,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim(),
      images: form.images
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
      features: form.features
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: form.status,
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
      parking: Number(form.parking) || 0,
    };

    try {
      if (editingId) {
        await api.put(`/properties/${editingId}`, payload);
        setMessage('Property updated.');
      } else {
        await api.post('/properties', payload);
        setMessage('Property created.');
      }
      await loadProperties();
      setTab('properties');
      setEditingId(null);
      setForm(emptyForm);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Save failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setMessage('Property deleted.');
    } catch {
      setError('Delete failed');
    }
  }

  async function updateAppointmentStatus(id: string, status: string) {
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => (a._id === id ? data.appointment : a)));
    } catch {
      setError('Could not update appointment');
    }
  }

  return (
    <div className="container admin-layout">
      <div className="page-title">
        <p className="eyebrow">Dashboard</p>
        <h1>Admin</h1>
        <p>Manage listings and review scheduled visits.</p>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'properties' ? 'active' : ''}
          onClick={() => setTab('properties')}
        >
          Properties
        </button>
        <button
          type="button"
          className={tab === 'appointments' ? 'active' : ''}
          onClick={() => setTab('appointments')}
        >
          Appointments
        </button>
        <button type="button" className={tab === 'form' ? 'active' : ''} onClick={startCreate}>
          {editingId ? 'Edit property' : 'Add property'}
        </button>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{message}</div>}
      {error && <div className="alert" style={{ marginBottom: '1rem' }}>{error}</div>}

      {tab === 'properties' && (
        <div className="admin-table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6}>No properties yet.</td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{listingLabel(p.listingType)}</td>
                    <td>{formatPrice(p.price, p.listingType)}</td>
                    <td>
                      {p.city}, {p.state}
                    </td>
                    <td>
                      <span className={`status-pill ${p.status}`}>{p.status}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => startEdit(p)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'appointments' && (
        <div className="admin-table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Property</th>
                <th>Visitor</th>
                <th>When</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5}>No appointments yet.</td>
                </tr>
              ) : (
                appointments.map((a) => {
                  const prop = typeof a.property === 'object' ? a.property : null;
                  return (
                    <tr key={a._id}>
                      <td>{prop?.title || '—'}</td>
                      <td>
                        <div>{a.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                          {a.email} · {a.phone}
                        </div>
                      </td>
                      <td>
                        {new Date(a.preferredDate).toLocaleDateString()} · {a.preferredTime}
                      </td>
                      <td>
                        <span className={`status-pill ${a.status}`}>{a.status}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => updateAppointmentStatus(a._id, 'confirmed')}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => updateAppointmentStatus(a._id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'form' && (
        <form className="admin-form" onSubmit={handleSave}>
          <h2 style={{ fontSize: '1.8rem' }}>{editingId ? 'Edit property' : 'Add property'}</h2>
          <div className="admin-form-grid">
            <div className="field full">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="field full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="listingType">Listing type</label>
              <select
                id="listingType"
                value={form.listingType}
                onChange={(e) => setForm({ ...form, listingType: e.target.value })}
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                id="bedrooms"
                type="number"
                min={0}
                required
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                id="bathrooms"
                type="number"
                min={0}
                step={0.5}
                required
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="area">Area (sqft)</label>
              <input
                id="area"
                type="number"
                min={0}
                required
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="zip">ZIP</label>
              <input
                id="zip"
                required
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="yearBuilt">Year built</label>
              <input
                id="yearBuilt"
                type="number"
                value={form.yearBuilt}
                onChange={(e) => setForm({ ...form, yearBuilt: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="parking">Parking spaces</label>
              <input
                id="parking"
                type="number"
                min={0}
                value={form.parking}
                onChange={(e) => setForm({ ...form, parking: e.target.value })}
              />
            </div>
            <div className="field full">
              <label htmlFor="images">Image URLs (one per line)</label>
              <textarea
                id="images"
                required
                placeholder="https://..."
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
              />
            </div>
            <div className="field full">
              <label htmlFor="features">Features (comma-separated)</label>
              <input
                id="features"
                placeholder="Pool, Garage, Fireplace"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>
          </div>
          <div className="row-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : editingId ? 'Update property' : 'Create property'}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => {
                setTab('properties');
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
