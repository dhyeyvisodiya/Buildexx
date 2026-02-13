import React from 'react';
import { getImageUrl } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * CompareProperties - Side-by-side comparison of 2-3 properties
 * Comparison fields: Price, Area, Bedrooms, Bathrooms, Amenities, Location, Status
 */
const CompareProperties = ({ properties, onRemove, onClose, isOpen }) => {
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        if (!value) return 'N/A';
        const num = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
        if (isNaN(num)) return value;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    };

    const formatPricePerSqft = (price, area) => {
        if (!price || !area) return 'N/A';
        const priceNum = parseFloat(price.toString().replace(/[^0-9.-]/g, ''));
        const areaNum = parseFloat(area);
        if (isNaN(priceNum) || isNaN(areaNum) || areaNum === 0) return 'N/A';
        return formatCurrency(priceNum / areaNum) + '/sq.ft';
    };

    const comparisonFields = [
        { label: 'Price', getValue: (p) => (p.purpose?.toLowerCase() === 'rent' ? `${formatCurrency(p.rent || p.rentAmount)}/mo` : formatCurrency(p.price)) },
        { label: 'Price/Sq.ft', getValue: (p) => formatPricePerSqft(p.price, p.area || p.areaSqft) },
        { label: 'Area', getValue: (p) => p.area || p.areaSqft ? `${p.area || p.areaSqft} sq.ft` : 'N/A' },
        { label: 'Bedrooms', getValue: (p) => p.bedrooms || 'N/A' },
        { label: 'Bathrooms', getValue: (p) => p.bathrooms || 'N/A' },
        { label: 'Type', getValue: (p) => p.type || 'N/A' },
        { label: 'Purpose', getValue: (p) => p.purpose || 'N/A' },
        { label: 'Construction', getValue: (p) => p.constructionStatus || 'N/A' },
        { label: 'Possession', getValue: (p) => p.possession || p.possessionYear || 'N/A' },
        { label: 'Location', getValue: (p) => [p.locality, p.city].filter(Boolean).join(', ') || 'N/A' },
        { label: 'Status', getValue: (p) => p.availability || 'Available' },
        { label: 'Builder', getValue: (p) => p.builder_name || 'N/A' },
        {
            label: 'Verified',
            getValue: (p) => p.is_verified || p.isVerified ? '✅ Yes' : '❌ No',
            isHighlight: true
        }
    ];

    // Get amenities union for comparison
    const getAmenitiesList = (properties) => {
        const allAmenities = new Set();
        properties.forEach(p => {
            const amenities = p.amenities || [];
            const amenitiesArr = typeof amenities === 'string' ? amenities.split(',').map(a => a.trim()) : amenities;
            amenitiesArr.forEach(a => allAmenities.add(a));
        });
        return Array.from(allAmenities).filter(a => a);
    };

    if (!isOpen || properties.length === 0) return null;

    const allAmenities = getAmenitiesList(properties);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050,
                    padding: '20px'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                        background: '#0F1E33',
                        borderRadius: '20px',
                        padding: '0',
                        maxWidth: '95vw',
                        width: properties.length > 2 ? '1200px' : '900px',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #112A46, #0F1E33)',
                        padding: '24px 32px',
                        borderBottom: '1px solid rgba(200, 162, 74, 0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="bi bi-layout-split" style={{ color: '#C8A24A' }}></i>
                                Compare Properties
                            </h3>
                            <p style={{ color: '#94A3B8', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                                {properties.length} of 3 properties selected
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: '#94A3B8',
                                fontSize: '1.5rem',
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 100px)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            {/* Property Headers */}
                            <thead>
                                <tr>
                                    <th style={{
                                        background: '#112A46',
                                        padding: '20px',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        width: '180px',
                                        borderRight: '1px solid rgba(200, 162, 74, 0.1)'
                                    }}></th>
                                    {properties.map((property, idx) => (
                                        <th key={property.id || idx} style={{
                                            background: '#112A46',
                                            padding: '20px',
                                            position: 'sticky',
                                            top: 0,
                                            zIndex: 10,
                                            borderRight: idx < properties.length - 1 ? '1px solid rgba(200, 162, 74, 0.1)' : 'none'
                                        }}>
                                            <div style={{ position: 'relative' }}>
                                                {/* Remove button */}
                                                <button
                                                    onClick={() => onRemove(property.id)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-10px',
                                                        background: '#EF4444',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>

                                                {/* Property Image */}
                                                <div style={{
                                                    width: '100%',
                                                    height: '120px',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    marginBottom: '12px'
                                                }}>
                                                    {property.images && property.images[0] ? (
                                                        <img
                                                            src={getImageUrl(property.images[0])}
                                                            alt={property.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            background: '#1E3A5F',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <i className="bi bi-image" style={{ color: '#64748B', fontSize: '2rem' }}></i>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Property Name */}
                                                <h5 style={{ color: '#FFFFFF', margin: '0 0 4px 0', fontSize: '1rem' }}>
                                                    {property.name || 'Untitled Property'}
                                                </h5>

                                                {/* View Button */}
                                                <button
                                                    onClick={() => {
                                                        onClose();
                                                        navigate(`/property/${property.id}`);
                                                    }}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 16px',
                                                        color: '#0F172A',
                                                        fontWeight: '600',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                        marginTop: '8px'
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Comparison Rows */}
                            <tbody>
                                {comparisonFields.map((field, idx) => (
                                    <tr key={field.label}>
                                        <td style={{
                                            padding: '16px 20px',
                                            fontWeight: '600',
                                            color: '#94A3B8',
                                            background: idx % 2 === 0 ? 'rgba(17, 42, 70, 0.5)' : 'transparent',
                                            borderRight: '1px solid rgba(200, 162, 74, 0.1)'
                                        }}>
                                            {field.label}
                                        </td>
                                        {properties.map((property, pIdx) => {
                                            const value = field.getValue(property);
                                            // Highlight best value for certain fields
                                            const isVerifiedField = field.label === 'Verified';

                                            return (
                                                <td key={property.id || pIdx} style={{
                                                    padding: '16px 20px',
                                                    color: isVerifiedField && value.includes('✅') ? '#10B981' : '#FFFFFF',
                                                    background: idx % 2 === 0 ? 'rgba(17, 42, 70, 0.5)' : 'transparent',
                                                    borderRight: pIdx < properties.length - 1 ? '1px solid rgba(200, 162, 74, 0.1)' : 'none',
                                                    textAlign: 'center',
                                                    fontWeight: field.label === 'Price' ? '700' : '500'
                                                }}>
                                                    {value}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}

                                {/* Amenities Section */}
                                {allAmenities.length > 0 && (
                                    <>
                                        <tr>
                                            <td colSpan={properties.length + 1} style={{
                                                padding: '16px 20px',
                                                fontWeight: '700',
                                                color: '#C8A24A',
                                                background: '#112A46',
                                                borderTop: '1px solid rgba(200, 162, 74, 0.2)'
                                            }}>
                                                <i className="bi bi-check2-circle me-2"></i>
                                                Amenities Comparison
                                            </td>
                                        </tr>
                                        {allAmenities.slice(0, 10).map((amenity, idx) => (
                                            <tr key={amenity}>
                                                <td style={{
                                                    padding: '12px 20px',
                                                    color: '#94A3B8',
                                                    background: idx % 2 === 0 ? 'rgba(17, 42, 70, 0.5)' : 'transparent',
                                                    borderRight: '1px solid rgba(200, 162, 74, 0.1)',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {amenity}
                                                </td>
                                                {properties.map((property, pIdx) => {
                                                    const amenities = property.amenities || [];
                                                    const amenitiesArr = typeof amenities === 'string'
                                                        ? amenities.split(',').map(a => a.trim().toLowerCase())
                                                        : amenities.map(a => a.toLowerCase());
                                                    const hasAmenity = amenitiesArr.includes(amenity.toLowerCase());

                                                    return (
                                                        <td key={property.id || pIdx} style={{
                                                            padding: '12px 20px',
                                                            textAlign: 'center',
                                                            background: idx % 2 === 0 ? 'rgba(17, 42, 70, 0.5)' : 'transparent',
                                                            borderRight: pIdx < properties.length - 1 ? '1px solid rgba(200, 162, 74, 0.1)' : 'none'
                                                        }}>
                                                            {hasAmenity ? (
                                                                <i className="bi bi-check-circle-fill" style={{ color: '#10B981', fontSize: '1.2rem' }}></i>
                                                            ) : (
                                                                <i className="bi bi-x-circle" style={{ color: '#64748B', fontSize: '1.2rem' }}></i>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompareProperties;
