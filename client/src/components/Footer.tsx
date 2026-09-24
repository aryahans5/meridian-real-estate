export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">Meridian</div>
          <p style={{ marginTop: '0.5rem', maxWidth: '22rem' }}>
            Curated homes and commercial spaces across the country — searched thoughtfully, shown with care.
          </p>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} Meridian Homes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
