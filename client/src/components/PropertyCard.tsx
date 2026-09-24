import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { formatPrice, listingLabel } from '../lib/api';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="property-card">
      <Link to={`/properties/${property._id}`} className="property-card-media">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
        />
        <span className="property-badge">{listingLabel(property.listingType)}</span>
      </Link>
      <div className="property-card-body">
        <Link to={`/properties/${property._id}`}>
          <h3>{property.title}</h3>
        </Link>
        <p className="property-meta">
          {property.city}, {property.state}
        </p>
        <p className="property-price">{formatPrice(property.price, property.listingType)}</p>
        <div className="property-stats">
          {property.listingType !== 'commercial' && (
            <>
              <span>{property.bedrooms} bed</span>
              <span>{property.bathrooms} bath</span>
            </>
          )}
          <span>{property.area.toLocaleString()} sqft</span>
        </div>
      </div>
    </article>
  );
}
