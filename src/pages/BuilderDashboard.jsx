import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import MapLocationPicker from '../components/MapLocationPicker';
import TabLoading from '../components/TabLoading';
import {
  getPropertiesByBuilder,
  createProperty,
  updateProperty,
  deleteProperty,
  getBuilderEnquiries,
  updateEnquiryStatus,
  getRentRequestsByBuilder,

  updateRentRequestStatus,
  updatePropertyAvailability,
  uploadLegalDocument,
  uploadPanoramaImages,
  getBuilderPayments,
  createWithdrawalRequest,
  getBuilderWithdrawals
} from '../../api/apiService';
import { getApiUrl } from '../config';
import '../DashboardStyles.css';

const BuilderDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const getAllowedStatuses = (currentStatus, purpose) => {
    const p = (purpose || '').toLowerCase();
    const current = (currentStatus || 'available').toLowerCase();

    if (p === 'rent') {
      return ['available', 'booked', 'rented'];
    }
    // Buy
    if (current === 'sold') return ['sold'];
    return ['available', 'booked', 'sold'];
  };

  const handleAvailabilityChange = async (propertyId, newStatus, currentStatus, purpose) => {
    if (newStatus === currentStatus) return;

    if ((currentStatus || '').toLowerCase() === 'sold' && newStatus === 'available') {
      toast.error("Cannot revert 'Sold' status. Contact Admin.");
      return;
    }

    try {
      setUpdatingId(propertyId);
      const result = await updatePropertyAvailability(propertyId, newStatus);

      if (result.success) {
        toast.success("Status updated successfully");
        setProperties(prev => prev.map(p =>
          p.id === propertyId ? { ...p, availability_status: newStatus } : p
        ));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (e) {
      toast.error("An error occurred");
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Form state for adding/editing property
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    type: '',
    purpose: '',
    price: '',
    rent: '',
    area: '',
    city: '',
    locality: '',
    latitude: '',
    longitude: '',
    googleMapLink: '',
    possession: '',
    constructionStatus: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
    images: [],
    availability: 'available',
    brochureUrl: '',
    legalDocumentPath: '',
    panoramaImagePath: '', // Keep for backward compatibility or single file fallback
    panoramaImages: [] // New array for multiple 360 images
  });

  // State management from database
  const [properties, setProperties] = useState([]);
  const [buyEnquiries, setBuyEnquiries] = useState([]);
  const [rentRequests, setRentRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]); // List of withdrawals/balance info
  const [balance, setBalance] = useState({ totalEarned: 0, currentBalance: 0 }); // Derived from withdrawals API
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  // Fetch data on mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchBuilderData();
    }
  }, [currentUser]);

  const fetchBuilderData = async () => {
    setLoading(true);
    try {
      // Execute all fetches in parallel
      const [propertiesResult, enquiriesResult, rentResult, paymentsResult, withdrawalsResult] = await Promise.all([
        getPropertiesByBuilder(currentUser.id),
        getBuilderEnquiries(currentUser.id),
        getRentRequestsByBuilder(currentUser.id),
        getBuilderPayments(currentUser.id),
        getBuilderWithdrawals(currentUser.id)
      ]);

      // Handle properties
      if (propertiesResult.success) {
        setProperties(propertiesResult.data);
      }

      // Handle enquiries
      if (enquiriesResult.success) {
        setBuyEnquiries(enquiriesResult.data);
      }

      // Handle rent requests
      if (rentResult.success) {
        setRentRequests(rentResult.data);
      }

      // Handle payments
      // apiService returns array
      setPayments(Array.isArray(paymentsResult) ? paymentsResult : (paymentsResult.data || []));

      // Handle withdrawals
      if (withdrawalsResult.success) {
        setWithdrawals(withdrawalsResult.data);
        setBalance({
          totalEarned: withdrawalsResult.totalEarned || 0,
          currentBalance: withdrawalsResult.balance || 0
        });
      }

    } catch (error) {
      console.error('Error fetching builder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) return alert('Please enter a valid amount');
    if (amount > balance.currentBalance) return alert('Insufficient Balance');

    if (!window.confirm(`Request withdrawal of ₹${amount}?`)) return;

    setLoading(true);
    try {
      const result = await createWithdrawalRequest(currentUser.id, amount);
      if (result.success) {
        alert('Withdrawal request submitted successfully!');
        setWithdrawalAmount('');
        fetchBuilderData(); // Refresh data
      } else {
        alert('Failed to request withdrawal: ' + result.error);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
      setPropertyForm(prev => {
        const currentImages = Array.isArray(prev.images) ? prev.images : [];
        return { ...prev, images: [...currentImages, ...base64Images] };
      });
    }).catch(err => console.error('Image upload failed', err));
  };

  const validatePanoramaDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Check for 2:1 aspect ratio with 5% tolerance
        const ratio = img.width / img.height;
        const isValid = Math.abs(ratio - 2) < 0.1; // Allow 1.9 - 2.1
        if (!isValid) {
          alert(`Skipped ${file.name}: Image dimensions ${img.width}x${img.height} do not match 2: 1 aspect ratio required for 360° view.`);
        }
        resolve(isValid ? file : null);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        alert(`Failed to load image: ${file.name} `);
        resolve(null);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();

    // Validation - check price for Buy, rent for Rent
    const priceField = propertyForm.purpose === 'Rent' ? 'rent' : 'price';
    const requiredFields = ['name', 'type', 'purpose', priceField];
    const missingField = requiredFields.find(field => !propertyForm[field]);

    if (missingField) {
      setFormMessage({ type: 'error', text: 'Please fill in all required fields' });

      // Auto-scroll to the missing field
      // We need to wait a tick for the error message to render (optional) or just scroll immediately
      // Assuming inputs have 'name' attribute matching the field name
      const element = document.querySelector(`[name = "${missingField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }

      return;
    }

    setLoading(true);
    try {
      if (editMode && editingPropertyId) {
        // Update existing property
        const result = await updateProperty(editingPropertyId, propertyForm);
        if (result.success) {
          setProperties(prev => prev.map(p => p.id === editingPropertyId ? result.data : p));
          resetForm();
          setFormMessage({ type: 'success', text: 'Property updated successfully!' });
        } else {
          setFormMessage({ type: 'error', text: result.error || 'Failed to update property' });
        }
      } else {
        // Create new property
        console.log('[BuilderDashboard] Creating property with:');
        console.log('[BuilderDashboard] currentUser:', currentUser);
        console.log('[BuilderDashboard] currentUser.id:', currentUser?.id);
        console.log('[BuilderDashboard] Using builderId:', currentUser?.id);

        const result = await createProperty({
          builderId: currentUser.id,
          ...propertyForm
        });
        if (result.success) {
          setProperties(prev => [...prev, result.data]);
          resetForm();
          setFormMessage({ type: 'success', text: 'Property added successfully! Pending admin approval.' });
        } else {
          setFormMessage({ type: 'error', text: result.error || 'Failed to add property' });
        }
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Failed to save property' });
    } finally {
      setLoading(false);
      setTimeout(() => setFormMessage({ type: '', text: '' }), 5000);
    }
  };

  const resetForm = () => {
    setPropertyForm({
      name: '',
      type: '',
      purpose: '',
      price: '',
      rent: '',
      area: '',
      city: '',
      locality: '',
      latitude: '',
      longitude: '',
      googleMapLink: '',
      possession: '',
      constructionStatus: '',
      description: '',
      bedrooms: '',
      bathrooms: '',
      amenities: '',
      images: [],
      availability: 'available',
      brochureUrl: '',
      legalDocumentPath: '',
      panoramaImagePath: '',
      panoramaImages: []
    });
    setEditMode(false);
    setEditingPropertyId(null);
  };

  const handleEditProperty = (property) => {
    setPropertyForm({
      name: property.name || '',
      type: property.type || '',
      purpose: property.purpose || '',
      price: property.price || '',
      rent: property.rent || '',
      area: property.area || '',
      city: property.city || '',
      locality: property.locality || '',
      latitude: property.latitude || '',
      longitude: property.longitude || '',
      googleMapLink: property.google_map_link || '',
      possession: property.possession || '',
      constructionStatus: property.construction_status || '',
      description: property.description || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : (property.amenities || ''),
      images: Array.isArray(property.images) ? property.images : (property.images ? property.images.split(',') : []),
      availability: property.availability || 'available',
      brochureUrl: property.brochure_url || '',
      legalDocumentPath: property.legal_document_path || '',
      panoramaImagePath: property.panorama_image_path || '',
      panoramaImages: property.panorama_images || []
    });
    setEditMode(true);
    setEditingPropertyId(property.id);
    setActiveTab('add-property');
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const result = await deleteProperty(id);
      if (result.success) {
        setProperties(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleApproveEnquiry = async (id) => {
    try {
      const result = await updateEnquiryStatus(id, 'approved');
      if (result.success) {
        setBuyEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
      }
    } catch (error) {
      console.error('Error approving enquiry:', error);
    }
  };

  const handleRejectEnquiry = async (id) => {
    try {
      const result = await updateEnquiryStatus(id, 'rejected');
      if (result.success) {
        setBuyEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
      }
    } catch (error) {
      console.error('Error rejecting enquiry:', error);
    }
  };

  const handleApproveRent = async (id) => {
    try {
      const result = await updateRentRequestStatus(id, 'approved');
      if (result.success) {
        setRentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      }
    } catch (error) {
      console.error('Error approving rent request:', error);
    }
  };

  const handleRejectRent = async (id) => {
    try {
      const result = await updateRentRequestStatus(id, 'rejected');
      if (result.success) {
        setRentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      }
    } catch (error) {
      console.error('Error rejecting rent request:', error);
    }
  };

  const stats = {
    totalProperties: properties.length,
    pendingEnquiries: buyEnquiries.filter(e => e.status === 'pending').length,
    pendingRentRequests: rentRequests.filter(r => r.status === 'pending').length,
    approvedProperties: properties.filter(p => p.status === 'approved').length
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid' },
    { id: 'add-property', label: 'Add Property', icon: 'bi-plus-circle' },
    { id: 'my-properties', label: 'My Properties', icon: 'bi-building' },
    { id: 'enquiries', label: 'Enquiries', icon: 'bi-envelope' },
    { id: 'rent-requests', label: 'Rent Requests', icon: 'bi-key' },
    { id: 'received-payments', label: 'Withdrawals', icon: 'bi-wallet2' },
    { id: 'transactions', label: 'Transactions', icon: 'bi-receipt' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'white',
    transition: 'all 0.3s ease'
  };

  const isResidential = ['Apartment', 'Villa', 'House', 'Guest House', 'Farmhouse'].includes(propertyForm.type);
  const isCommercial = ['Commercial', 'Office', 'Industrial', 'Warehouse'].includes(propertyForm.type);
  const isLand = ['Plot', 'Agricultural Land'].includes(propertyForm.type);

  return (
    <div className="builder-dashboard-page" style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
      <div className="container-fluid py-4">
        {/* Dashboard Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div style={{
              background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--charcoal-slate) 100%)',
              borderRadius: '20px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(200,162,74,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />

              <div className="d-flex align-items-center gap-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'var(--construction-gold)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-person-workspace fs-1" style={{ color: 'var(--charcoal-slate)' }}></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-text)' }}>
                    Builder Dashboard
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    Welcome, {currentUser?.full_name || currentUser?.username || 'Builder/Owner'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="dashboard-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dashboard - tab ${activeTab === tab.id ? 'active' : ''} `}
              >
                <i className={`bi ${tab.icon} `}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <TabLoading text={`Loading ${activeTab === 'overview' ? 'dashboard overview' : activeTab === 'add-property' ? 'property form' : activeTab === 'my-properties' ? 'your properties' : activeTab === 'enquiries' ? 'enquiries' : activeTab === 'rent-requests' ? 'rent requests' : activeTab === 'payments' ? 'payments' : 'withdrawals'}...`} />
        )}

        {/* Overview Tab */}
        {!loading && activeTab === 'overview' && (
          <div className="row g-4">
            {/* Stats Cards */}
            {[
              { label: 'Total Properties', value: stats.totalProperties, icon: 'bi-building', color: '#C8A24A' },
              { label: 'Approved', value: stats.approvedProperties, icon: 'bi-check-circle', color: '#10B981' },
              { label: 'Pending Enquiries', value: stats.pendingEnquiries, icon: 'bi-envelope', color: '#3B82F6' },
              { label: 'Rent Requests', value: stats.pendingRentRequests, icon: 'bi-key', color: '#8B5CF6' }
            ].map((stat, index) => (
              <div className="col-md-3 col-6" key={index}>
                <div style={{
                  background: 'var(--card-bg)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: 'var(--card-shadow)',
                  border: 'none',
                  height: '100%'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: index === 0 ? '#112A46' :
                        index === 1 ? 'rgba(46, 204, 113, 0.15)' :
                          index === 2 ? 'rgba(243, 156, 18, 0.15)' :
                            'rgba(155, 89, 182, 0.15)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className={`bi ${stat.icon} fs - 4`} style={{ color: stat.color }}></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-text)', fontSize: '1.5rem' }}>{stat.value}</h3>
                      <p style={{ color: 'var(--secondary-text)', margin: 0, fontSize: '0.85rem' }}>{stat.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="col-12">
              <div style={{
                background: '#0F1E33',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0'
              }}>
                <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-text)' }}>Quick Actions</h5>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                      color: '#0F172A',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none'
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add New Property
                  </button>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="btn"
                    style={{
                      background: '#0F1E33',
                      color: '#64748B',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <i className="bi bi-envelope me-2"></i>View Enquiries ({stats.pendingEnquiries})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Property Tab */}
        {!loading && activeTab === 'add-property' && (
          <div style={{
            background: '#0F1E33',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #E2E8F0'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--primary-text)' }}>
                <i className={`bi ${editMode ? 'bi-pencil' : 'bi-plus-circle'} me - 2`} style={{ color: 'var(--construction-gold)' }}></i>
                {editMode ? 'Edit Property' : 'Add New Property'}
              </h5>
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-sm"
                  style={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                >
                  <i className="bi bi-x-lg me-1"></i>Cancel Edit
                </button>
              )}
            </div>

            {formMessage.text && (
              <div className={`alert ${formMessage.type === 'success' ? 'alert-success' : 'alert-danger'} mb - 4`} style={{ borderRadius: '12px' }}>
                {formMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitProperty}>
              <div className="row g-4">
                {/* Property Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={propertyForm.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter property name"
                    style={inputStyle}
                  />
                </div>

                {/* Property Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Type *</label>
                  <select
                    name="type"
                    value={propertyForm.type}
                    onChange={handleInputChange}
                    className="form-select"
                    style={inputStyle}
                  >
                    <option value="" style={{ color: 'black' }}>Select Type</option>
                    <option value="Apartment" style={{ color: 'black' }}>Apartment</option>
                    <option value="Villa" style={{ color: 'black' }}>Villa</option>
                    <option value="House" style={{ color: 'black' }}>House</option>
                    <option value="Plot" style={{ color: 'black' }}>Plot</option>
                    <option value="Commercial" style={{ color: 'black' }}>Commercial</option>
                    <option value="Office" style={{ color: 'black' }}>Office Space</option>
                    <option value="Farmhouse" style={{ color: 'black' }}>Farmhouse</option>
                    <option value="Guest House" style={{ color: 'black' }}>Guest House</option>
                    <option value="Industrial" style={{ color: 'black' }}>Industrial</option>
                    <option value="Warehouse" style={{ color: 'black' }}>Warehouse</option>
                  </select>
                </div>

                <AnimatePresence>
                  {propertyForm.type && (
                    <motion.div
                      className="col-12 row g-4 m-0 p-0"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >


                      {/* Purpose */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Purpose *</label>
                        <select
                          name="purpose"
                          value={propertyForm.purpose}
                          onChange={handleInputChange}
                          className="form-select"
                          style={inputStyle}
                        >
                          <option value="" style={{ color: 'black' }}>Select Purpose</option>
                          <option value="Buy" style={{ color: 'black' }}>For Sale</option>
                          {/* Disable Rent for Land types */}
                          {!['Plot', 'Agricultural Land'].includes(propertyForm.type) && (
                            <option value="Rent" style={{ color: 'black' }}>For Rent</option>
                          )}
                        </select>
                        {/* Warning hint for uncommon combinations */}
                        {propertyForm.type === 'Guest House' && propertyForm.purpose === 'Buy' && (
                          <small style={{ color: '#F59E0B', display: 'block', marginTop: '4px' }}>
                            <i className="bi bi-info-circle me-1"></i>
                            Guest houses are typically listed for rent
                          </small>
                        )}
                        {propertyForm.type === 'Industrial' && propertyForm.purpose === 'Rent' && (
                          <small style={{ color: '#F59E0B', display: 'block', marginTop: '4px' }}>
                            <i className="bi bi-info-circle me-1"></i>
                            Industrial properties are usually sold or leased
                          </small>
                        )}
                      </div>

                      {/* Price/Rent */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>
                          {propertyForm.purpose === 'Rent' ? 'Monthly Rent *' : 'Price *'}
                        </label>
                        <input
                          type="text"
                          name={propertyForm.purpose === 'Rent' ? 'rent' : 'price'}
                          value={propertyForm.purpose === 'Rent' ? propertyForm.rent : propertyForm.price}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder={propertyForm.purpose === 'Rent' ? '₹ Monthly rent' : '₹ Enter price'}
                          style={inputStyle}
                        />
                      </div>

                      {/* Area */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Area (sq.ft)</label>
                        <input
                          type="text"
                          name="area"
                          value={propertyForm.area}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="e.g., 1200"
                          style={inputStyle}
                        />
                      </div>

                      {/* Bedrooms - Residential Only */}
                      {(isResidential) && (
                        <motion.div
                          className="col-md-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Bedrooms</label>
                          <select
                            name="bedrooms"
                            value={propertyForm.bedrooms}
                            onChange={handleInputChange}
                            className="form-select"
                            style={inputStyle}
                          >
                            <option value="" style={{ color: 'black' }}>Select</option>
                            <option value="1" style={{ color: 'black' }}>1 BHK</option>
                            <option value="2" style={{ color: 'black' }}>2 BHK</option>
                            <option value="3" style={{ color: 'black' }}>3 BHK</option>
                            <option value="4" style={{ color: 'black' }}>4 BHK</option>
                            <option value="5" style={{ color: 'black' }}>5+ BHK</option>
                          </select>
                        </motion.div>
                      )}

                      {/* Bathrooms - Residential & Commercial */}
                      {(!isLand) && (
                        <motion.div
                          className="col-md-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>
                            {isCommercial ? 'Washrooms' : 'Bathrooms'}
                          </label>
                          <select
                            name="bathrooms"
                            value={propertyForm.bathrooms}
                            onChange={handleInputChange}
                            className="form-select"
                            style={inputStyle}
                          >
                            <option value="" style={{ color: 'black' }}>Select</option>
                            <option value="1" style={{ color: 'black' }}>1</option>
                            <option value="2" style={{ color: 'black' }}>2</option>
                            <option value="3" style={{ color: 'black' }}>3</option>
                            <option value="4" style={{ color: 'black' }}>4+</option>
                          </select>
                        </motion.div>
                      )}

                      {/* City */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>City</label>
                        <input
                          type="text"
                          name="city"
                          value={propertyForm.city}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter city"
                          style={inputStyle}
                        />
                      </div>

                      {/* Locality */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Locality</label>
                        <input
                          type="text"
                          name="locality"
                          value={propertyForm.locality}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter locality/area"
                          style={inputStyle}
                        />
                      </div>

                      {/* Possession Year */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Possession Year</label>
                        <input
                          type="number"
                          name="possession"
                          value={propertyForm.possession}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="e.g. 2025"
                          style={inputStyle}
                        />
                      </div>

                      {/* Construction Status */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Construction Status</label>
                        <select
                          name="constructionStatus"
                          value={propertyForm.constructionStatus}
                          onChange={handleInputChange}
                          className="form-select"
                          style={inputStyle}
                        >
                          <option value="" style={{ color: 'black' }}>Select Status</option>
                          <option value="Completed" style={{ color: 'black' }}>Completed</option>
                          <option value="Under Construction" style={{ color: 'black' }}>Under Construction</option>
                          <option value="New Launch" style={{ color: 'black' }}>New Launch</option>
                        </select>
                      </div>

                      {/* Availability Status */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Availability Status</label>
                        <select
                          name="availability"
                          value={propertyForm.availability}
                          onChange={handleInputChange}
                          className="form-select"
                          style={inputStyle}
                        >
                          <option value="available" style={{ color: 'black' }}>Available</option>
                          <option value="booked" style={{ color: 'black' }}>Booked</option>
                          {/* Show Rented for Rent purpose, Sold for Buy purpose */}
                          {propertyForm.purpose === 'Rent' ? (
                            <option value="rented" style={{ color: 'black' }}>Rented</option>
                          ) : (
                            <option value="sold" style={{ color: 'black' }}>Sold</option>
                          )}
                        </select>
                        <small style={{ color: '#64748B', display: 'block', marginTop: '4px' }}>
                          {propertyForm.purpose === 'Rent'
                            ? 'Available → Booked → Rented'
                            : 'Available → Booked → Sold'
                          }
                        </small>
                      </div>

                      {/* Brochure Upload */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>
                          <i className="bi bi-file-pdf me-1" style={{ color: '#DC2626' }}></i>
                          Brochure (PDF)
                        </label>
                        <div className="d-flex flex-column gap-2">
                          {/* File Upload */}
                          <div style={{ position: 'relative' }}>
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              id="brochureUpload"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (file.type !== 'application/pdf') {
                                    alert('Please upload a PDF file');
                                    return;
                                  }
                                  if (file.size > 10 * 1024 * 1024) {
                                    alert('File size must be less than 10MB');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setPropertyForm(prev => ({
                                      ...prev,
                                      brochureUrl: event.target.result
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="form-control"
                              style={{
                                ...inputStyle,
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                          {/* Or URL input */}
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ color: '#64748B', fontSize: '0.8rem' }}>or paste URL:</span>
                            <input
                              type="text"
                              name="brochureUrl"
                              value={propertyForm.brochureUrl?.startsWith('data:') ? '' : propertyForm.brochureUrl}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://..."
                              style={{ ...inputStyle, flex: 1, padding: '8px 12px' }}
                            />
                          </div>

                          {propertyForm.brochureUrl && (
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <i className="bi bi-check-circle-fill" style={{ color: '#10B981' }}></i>
                              <span style={{ color: '#10B981', fontSize: '0.85rem' }}>
                                {propertyForm.brochureUrl.startsWith('data:') ? 'PDF uploaded' : 'URL set'}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => setPropertyForm(prev => ({ ...prev, brochureUrl: '' }))}
                                style={{ color: '#DC2626', background: 'transparent', border: 'none', padding: '2px 8px' }}
                              >
                                <i className="bi bi-x-circle"></i> Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Legal Document Upload */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>
                          <i className="bi bi-shield-check me-1" style={{ color: '#10B981' }}></i>
                          Legal Document (PDF)
                        </label>
                        <div className="d-flex flex-column gap-2">
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.type !== 'application/pdf') {
                                  alert('Please upload a PDF file');
                                  return;
                                }
                                setLoading(true);
                                const result = await uploadLegalDocument(file);
                                setLoading(false);
                                if (result.success) {
                                  setPropertyForm(prev => ({ ...prev, legalDocumentPath: result.data }));
                                  alert('Legal document uploaded successfully!');
                                } else {
                                  alert('Failed to upload document');
                                }
                              }
                            }}
                            className="form-control"
                            style={inputStyle}
                          />
                          {propertyForm.legalDocumentPath && (
                            <div className="text-success small">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Document Uploaded
                            </div>
                          )}
                          <small className="text-muted" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            * Visible only to Admin for verification
                          </small>
                        </div>
                      </div>

                      {/* Multi-360 Image Upload */}
                      <div className="col-md-12">
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>
                          <i className="bi bi-camera-reels me-1" style={{ color: '#3B82F6' }}></i>
                          360° Panorama Images (Walkthrough)
                        </label>
                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex gap-2 align-items-center">
                            <input
                              type="file"
                              multiple
                              accept=".jpg,.jpeg,.png"
                              id="panorama-upload"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files);
                                if (files.length > 0) {
                                  setLoading(true);

                                  // Validate Dimensions
                                  const validFiles = [];
                                  for (const file of files) {
                                    const validFile = await validatePanoramaDimensions(file);
                                    if (validFile) validFiles.push(validFile);
                                  }

                                  if (validFiles.length === 0) {
                                    setLoading(false);
                                    e.target.value = null; // Reset input
                                    return;
                                  }

                                  const result = await uploadPanoramaImages(validFiles);
                                  setLoading(false);
                                  if (result.success) {
                                    setPropertyForm(prev => ({
                                      ...prev,
                                      panoramaImages: [...(prev.panoramaImages || []), ...result.data]
                                    }));
                                    alert(`${validFiles.length} panorama image(s) uploaded successfully!`);
                                  } else {
                                    alert('Failed to upload panorama images');
                                  }
                                  // Reset input
                                  e.target.value = null;
                                }
                              }}
                              className="form-control"
                              style={{ display: 'none' }}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => document.getElementById('panorama-upload').click()}
                              style={{ border: '1px dashed #3B82F6', color: '#3B82F6', borderRadius: '10px' }}
                            >
                              <i className="bi bi-cloud-upload me-2"></i> Upload 360° Images
                            </button>
                          </div>
                          <div className="d-flex flex-column">
                            <small className="text-muted">Upload multiple images to create a walkthrough.</small>
                            <small style={{ color: '#F8FAFC', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', marginTop: '4px', width: 'fit-content' }}>
                              <i className="bi bi-info-circle me-1" style={{ color: '#3B82F6' }}></i>
                              Note: Please upload 360° images with <strong>2:1 aspect ratio</strong> (e.g. 6000x3000 or 4000x2000).
                            </small>
                          </div>

                          {/* Panorama Preview Grid */}
                          {propertyForm.panoramaImages && propertyForm.panoramaImages.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {propertyForm.panoramaImages.map((imgUrl, index) => (
                                <div key={index} className="position-relative" style={{ width: '100px', height: '60px' }}>
                                  <img
                                    src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:8081${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`}
                                    alt={`Panorama ${index + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #334155' }}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100x60?text=Error'; }}
                                  />
                                  < button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center"
                                    style={{ width: '18px', height: '18px', borderRadius: '50%', transform: 'translate(30%, -30%)' }}
                                    onClick={() => {
                                      setPropertyForm(prev => ({
                                        ...prev,
                                        panoramaImages: prev.panoramaImages.filter((_, i) => i !== index)
                                      }));
                                    }}
                                  >
                                    <i className="bi bi-x" style={{ fontSize: '12px' }}></i>
                                  </button >
                                  <div className="position-absolute bottom-0 start-0 bg-dark text-white px-1 rounded-1" style={{ fontSize: '10px', opacity: 0.8 }}>
                                    {index + 1}
                                  </div>
                                </div >
                              ))}
                            </div >
                          )}
                        </div >
                      </div >

                      {/* Property Location Section */}
                      < div className="col-12" >
                        <div style={{
                          background: 'rgba(200,162,74,0.05)',
                          border: '1px solid rgba(200,162,74,0.2)',
                          borderRadius: '16px',
                          padding: '24px',
                          marginTop: '16px'
                        }}>
                          <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-text)' }}>
                            <i className="bi bi-geo-alt-fill me-2" style={{ color: 'var(--construction-gold)' }}></i>
                            Property Location (Map Pin)
                          </h5>
                          <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '16px' }}>
                            Pin your property location on the map. Users will see this pin when viewing your property.
                          </p>
                          <MapLocationPicker
                            initialPosition={propertyForm.latitude && propertyForm.longitude ? {
                              lat: parseFloat(propertyForm.latitude),
                              lng: parseFloat(propertyForm.longitude)
                            } : null}
                            onLocationChange={(location) => {
                              if (location) {
                                setPropertyForm(prev => ({
                                  ...prev,
                                  latitude: location.latitude,
                                  longitude: location.longitude,
                                  googleMapLink: location.mapLink || prev.googleMapLink
                                }));
                              }
                            }}
                            height="300px"
                          />
                        </div>
                      </div >

                      {/* Description */}
                      < div className="col-12" >
                        <label className="form-label fw-semibold" style={{ color: '#0F172A' }}>Description</label>
                        <textarea
                          name="description"
                          value={propertyForm.description}
                          onChange={handleInputChange}
                          className="form-control"
                          rows="4"
                          placeholder="Describe the property features, location advantages, nearby facilities..."
                          style={inputStyle}
                        />
                      </div >

                      {/* Amenities */}
                      < div className="col-12" >
                        <label className="form-label fw-semibold" style={{ color: '#0F172A' }}>Amenities</label>
                        <input
                          type="text"
                          name="amenities"
                          value={propertyForm.amenities}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter amenities separated by commas (e.g., Pool, Gym, Parking, Garden)"
                          style={inputStyle}
                        />
                      </div >

                      {/* Images */}
                      < div className="col-12" >
                        <label className="form-label fw-semibold" style={{ color: 'var(--primary-text)' }}>Property Images</label>
                        <div className="mb-3">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="form-control mb-2"
                            style={{ background: 'var(--off-white)', color: 'var(--primary-text)', border: 'none' }}
                          />
                        </div>
                        <input
                          style={{ borderRadius: '10px', padding: '12px 16px', background: 'var(--off-white)', color: 'var(--primary-text)', border: 'none' }}
                          readOnly
                          value={Array.isArray(propertyForm.images) ? `${propertyForm.images.length} images selected` : ''}
                        />
                      </div >
                    </motion.div >
                  )}
                </AnimatePresence >
              </div >

              <div className="mt-4 pt-3 d-flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    color: '#0F172A',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none'
                  }}
                >
                  {loading ? 'Saving...' : editMode ? (
                    <><i className="bi bi-check-circle me-2"></i>Update Property</>
                  ) : (
                    <><i className="bi bi-plus-circle me-2"></i>Add Property</>
                  )}
                </button>
                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn"
                    style={{
                      background: '#F1F5F9',
                      color: '#64748B',
                      padding: '14px 32px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form >
          </div >
        )
        }

        {/* My Properties Tab */}
        {
          !loading && activeTab === 'my-properties' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: '#0F172A' }}>
                  <i className="bi bi-building me-2" style={{ color: '#C8A24A' }}></i>
                  My Properties ({properties.length})
                </h5>
                <button
                  onClick={() => setActiveTab('add-property')}
                  className="btn btn-sm"
                  style={{
                    background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                    color: '#0F172A',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none'
                  }}
                >
                  <i className="bi bi-plus me-1"></i>Add New
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--construction-gold)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className="bi bi-building" style={{ fontSize: '3rem', color: '#C8A24A' }}></i>
                  </div>
                  <h5 style={{ color: '#0F172A' }}>No properties listed yet</h5>
                  <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                    Start by adding your first property to get it listed on the platform
                  </p>
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="btn mt-3"
                    style={{
                      background: 'linear-gradient(135deg, #C8A24A, #9E7C2F)',
                      color: '#0F172A',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none'
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add Property
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Type</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Price</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Availability</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Approval Status</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map(property => (
                        <tr key={property.id}>
                          <td style={{ color: '#0F172A', fontWeight: '500' }}>{property.name}</td>
                          <td style={{ color: '#64748B' }}>{property.type}</td>
                          <td style={{ color: '#C8A24A', fontWeight: '600' }}>{property.price || property.rent}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: '120px', fontSize: '0.85rem', borderColor: '#E2E8F0', cursor: 'pointer' }}
                              value={(property.availability_status || 'available').toLowerCase()}
                              onChange={(e) => handleAvailabilityChange(property.id, e.target.value, property.availability_status, property.purpose)}
                              disabled={updatingId === property.id || ((property.availability_status || '').toLowerCase() === 'sold' && (property.purpose || '').toLowerCase() === 'buy')}
                            >
                              {getAllowedStatuses(property.availability_status, property.purpose).map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                            {updatingId === property.id && <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Updating...</small>}
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: property.status === 'approved' ? '#D1FAE5' : property.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                              color: property.status === 'approved' ? '#059669' : property.status === 'rejected' ? '#DC2626' : '#D97706'
                            }}>
                              {property.status === 'approved' ? 'Approved' : property.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm me-2"
                              style={{ color: '#3B82F6' }}
                              onClick={() => handleEditProperty(property)}
                              title="Edit Property"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ color: '#EF4444' }}
                              onClick={() => handleDeleteProperty(property.id)}
                              title="Delete Property"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }

        {/* Buy Enquiries Tab */}
        {
          !loading && activeTab === 'enquiries' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
                <i className="bi bi-envelope me-2" style={{ color: '#3B82F6' }}></i>
                Buy Enquiries ({buyEnquiries.length})
              </h5>

              {buyEnquiries.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #DBEAFE20, #DBEAFE10)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className="bi bi-envelope-open" style={{ fontSize: '3rem', color: '#60A5FA' }}></i>
                  </div>
                  <h5 style={{ color: '#0F172A' }}>No enquiries yet</h5>
                  <p style={{ color: '#64748B' }}>
                    When buyers show interest in your properties, their enquiries will appear here
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Customer</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyEnquiries.map(enquiry => (
                        <tr key={enquiry.id}>
                          <td style={{ color: '#0F172A' }}>{enquiry.property_name}</td>
                          <td style={{ color: '#64748B' }}>{enquiry.customer_name || enquiry.full_name}</td>
                          <td style={{ color: '#64748B' }}>{formatDate(enquiry.created_at)}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: enquiry.status === 'approved' ? '#D1FAE5' : enquiry.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                              color: enquiry.status === 'approved' ? '#059669' : enquiry.status === 'rejected' ? '#DC2626' : '#D97706'
                            }}>
                              {enquiry.status ? (enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)) : 'Pending'}
                            </span>
                          </td>
                          <td>
                            {enquiry.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-sm me-2"
                                  style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleApproveEnquiry(enquiry.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm"
                                  style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleRejectEnquiry(enquiry.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }

        {/* Rent Requests Tab */}
        {
          !loading && activeTab === 'rent-requests' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
                <i className="bi bi-key me-2" style={{ color: '#8B5CF6' }}></i>
                Rent Requests ({rentRequests.length})
              </h5>

              {rentRequests.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #EDE9FE20, #EDE9FE10)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <i className="bi bi-key" style={{ fontSize: '3rem', color: '#A78BFA' }}></i>
                  </div>
                  <h5 style={{ color: '#0F172A' }}>No rent requests</h5>
                  <p style={{ color: '#64748B' }}>
                    Rental requests for your properties will appear here
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Customer</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                        <th style={{ color: '#0F172A', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rentRequests.map(request => (
                        <tr key={request.id}>
                          <td style={{ color: '#0F172A' }}>{request.property_name}</td>
                          <td style={{ color: '#64748B' }}>{request.customer_name}</td>
                          <td style={{ color: '#64748B' }}>{formatDate(request.created_at)}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              background: request.status === 'approved' ? '#D1FAE5' : '#FEF3C7',
                              color: request.status === 'approved' ? '#059669' : '#D97706'
                            }}>
                              {request.status ? (request.status.charAt(0).toUpperCase() + request.status.slice(1)) : 'Pending'}
                            </span>
                          </td>
                          <td>
                            {request.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-sm me-2"
                                  style={{ background: '#10B981', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleApproveRent(request.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm"
                                  style={{ background: '#EF4444', color: 'white', borderRadius: '6px' }}
                                  onClick={() => handleRejectRent(request.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }

        {/* Withdrawals Tab */}
        {
          !loading && activeTab === 'received-payments' && (
            <div style={{
              background: '#0F1E33',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <h5 className="fw-bold mb-4" style={{ color: '#C8A24A' }}>
                <i className="bi bi-wallet2 me-2"></i>
                Withdrawals & Earnings
              </h5>

              {/* Balance Section */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981' }}>
                    <label className="d-block style={{ color: '#D4A437' }} small">Total Earnings</label>
                    <h3 style={{ color: '#10B981' }}>₹{balance.totalEarned}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 rounded" style={{ background: 'rgba(200, 162, 74, 0.1)', border: '1px solid #C8A24A' }}>
                    <label className="d-block small">Available Balance</label>
                    <h3 style={{ color: '#C8A24A' }}>₹{balance.currentBalance}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #475569' }}>
                    <label className="d-block small mb-2">Request Withdrawal</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent text-white border-secondary">₹</span>
                      <input
                        type="number"
                        className="form-control bg-transparent text-white border-secondary"
                        placeholder="Amount"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                      />
                      <button className="btn btn-warning" onClick={handleWithdrawalRequest}>Request</button>
                    </div>
                  </div>
                </div>
              </div>

              <h6 className="text-white mb-3">Withdrawal History</h6>
              {withdrawals.length === 0 ? (
                <p className="text-muted">No withdrawal history.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover" style={{ background: 'transparent' }}>
                    <thead>
                      <tr>
                        <th style={{ color: '#94A3B8' }}>Date</th>
                        <th style={{ color: '#94A3B8' }}>Requested</th>
                        <th style={{ color: '#94A3B8' }}>Commission</th>
                        <th style={{ color: '#94A3B8' }}>Payout</th>
                        <th style={{ color: '#94A3B8' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map(w => (
                        <tr key={w.id}>
                          <td>{formatDate(w.created_at)}</td>
                          <td className="fw-bold">₹{w.amount}</td>
                          <td className="text-danger">{w.status === 'approved' ? `₹${w.commission_amount}` : '-'}</td>
                          <td className="text-success">{w.status === 'approved' ? `₹${w.payout_amount}` : '-'}</td>
                          <td>
                            <span className={`badge ${w.status === 'approved' ? 'bg-success' : w.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                              {w.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        }

        {/* Transactions Tab */}
        {
          !loading && activeTab === 'transactions' && (
            <div style={{ background: '#0F1E33', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h5 className="fw-bold mb-4" style={{ color: '#F8FAFC' }}>
                <i className="bi bi-clock-history me-2" style={{ color: '#3B82F6' }}></i>
                Transaction History (Received Payments) ({payments.length})
              </h5>
              <div className="table-responsive">
                <table className="table table-hover table-dark" style={{ background: 'transparent' }}>
                  <thead>
                    <tr>
                      <th style={{ color: '#94A3B8' }}>Date</th>
                      <th style={{ color: '#94A3B8' }}>Property</th>
                      <th style={{ color: '#94A3B8' }}>Customer (User)</th>
                      <th style={{ color: '#94A3B8' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td>{formatDate(p.created_at)}</td>
                        <td>
                          <div className="fw-bold">{p.property_name || 'Deleted Property'}</div>
                        </td>
                        <td>
                          <div>{p.user_name || 'Unknown'}</div>
                          <small className="text-muted">{p.user_email}</small>
                        </td>
                        <td className="text-success fw-bold">₹{p.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default BuilderDashboard;
