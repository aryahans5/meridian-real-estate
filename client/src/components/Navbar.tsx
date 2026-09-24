import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <header className={`site-header${isHome ? ' is-home' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          Meridian
          <span>Homes</span>
        </Link>

        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Primary">
          <NavLink to="/properties" onClick={() => setOpen(false)}>
            Properties
          </NavLink>
          <NavLink to="/properties?listingType=buy" onClick={() => setOpen(false)}>
            Buy
          </NavLink>
          <NavLink to="/properties?listingType=rent" onClick={() => setOpen(false)}>
            Rent
          </NavLink>
          <NavLink to="/properties?listingType=commercial" onClick={() => setOpen(false)}>
            Commercial
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          {user && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Sign out
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/login" className={`btn btn-sm hide-sm ${isHome ? 'btn-outline' : 'btn-outline-dark'}`}>
                Sign in
              </Link>
              <Link to="/register" className="btn btn-sm btn-gold">
                Join
              </Link>
            </>
          ) : (
            <span className="hide-sm" style={{ fontSize: '0.88rem', opacity: 0.85 }}>
              {user.name}
            </span>
          )}
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
