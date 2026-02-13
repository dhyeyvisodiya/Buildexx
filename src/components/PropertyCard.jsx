import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const PropertyCard = ({ property, addToCompare, addToWishlist }) => {
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    if (!value) return '';
    const valStr = value.toString().replace(/,/g, '').replace('₹', '').replace(/\s/g, '');
    const num = parseFloat(valStr);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };
  const getAvailabilityClass = (availability) => {
    const status = (availability || '').toLowerCase();
    switch (status) {
      case 'available': return 'badge-available';
      case 'booked': return 'badge-booked';
      case 'sold': return 'badge-sold';
      case 'rented': return 'badge-rented';
      default: return 'badge-secondary';
    }
  };

  const getAvailabilityText = (availability) => {
    const status = (availability || '').toLowerCase();
    switch (status) {
      case 'available': return 'Available';
      case 'booked': return '🔄 Under Process';
      case 'sold': return 'Sold';
      case 'rented': return 'Rented';
      default: return availability || 'Unknown';
    }
  };

  return (
    <div className="property-card card h-100 animate__animated animate__fadeInUp" style={{
      cursor: 'pointer'
    }}>
      <div className="position-relative">
        <div className="property-image-wrapper" style={{ height: '250px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          {property.images && property.images.length > 0 ? (
            <img
              src={getImageUrl(property.images[0])}
              className="property-image card-img-top"
              alt={property.name}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="property-image bg-light d-flex align-items-center justify-content-center" style="height: 100%; width: 100%"><span>Image Error</span></div>';
              }}
            />
          ) : (
            <div className="property-image bg-light d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
              <span>No Image</span>
            </div>
          )}
        </div>
        <span className={`availability-badge ${getAvailabilityClass(property.availability)}`}>
          {getAvailabilityText(property.availability)}
        </span>
        {/* Verified Badge */}
        {(property.is_verified || property.isVerified) && (
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
          }}>
            <i className="bi bi-patch-check-fill"></i> Verified
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{property.name}</h5>
        <p className="card-text small">
          {[property.locality, property.city].filter(Boolean).join(', ') || property.city || 'Location N/A'}
          {/* Builder name with verified indicator */}
          {property.builder_name && (
            <span style={{ display: 'block', marginTop: '4px', color: '#64748B' }}>
              <i className="bi bi-person-fill me-1"></i>
              {property.builder_name}
              {(property.is_verified || property.isVerified) && (
                <i className="bi bi-patch-check-fill ms-1" style={{ color: '#10B981', fontSize: '0.8rem' }} title="Verified Builder"></i>
              )}
            </span>
          )}
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold fs-5">
              {(property.purpose || '').toUpperCase() === 'BUY'
                ? formatCurrency(property.price)
                : `${formatCurrency(property.rent || property.rentAmount || property.rent_amount)}/mo`}
            </span>
            <span className="badge" style={{ backgroundColor: 'var(--construction-gold)', color: 'var(--primary-text)' }}>{property.type}</span>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/property/${property.id}`)}
              style={{
                background: 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))',
                border: 'none',
                color: 'var(--primary-text)',
                borderRadius: '6px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--deep-bronze)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(90deg, var(--construction-gold), var(--deep-bronze))';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(158, 124, 47, 0.3)';
              }}
            >
              View Details
            </button>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => addToCompare(property)}
                style={{
                  border: '1px solid var(--construction-gold)',
                  color: 'var(--construction-gold)',
                  background: 'transparent',
                  borderRadius: '6px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F5F0E6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(200, 162, 74, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Compare
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => addToWishlist(property)}
                style={{
                  border: '1px solid var(--construction-gold)',
                  color: 'var(--construction-gold)',
                  background: 'transparent',
                  borderRadius: '6px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F5F0E6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(200, 162, 74, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default PropertyCard;