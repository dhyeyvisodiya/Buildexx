import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from '../components/PropertyCard';
import TabLoading from '../components/TabLoading';
import {
  getUserWishlist,
  removeFromWishlist as removeFromWishlistAPI,
  getUserEnquiries,
  getUserRentHistory,

  getUserPayments,
  fetchUserRentSubscriptions,
  payRent
} from '../api/apiService';
import '../DashboardStyles.css';

const UserDashboard = ({ wishlist: propsWishlist, removeFromWishlist: propsRemoveFromWishlist }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('userActiveTab') || 'overview');

  useEffect(() => {
    localStorage.setItem('userActiveTab', activeTab);
  }, [activeTab]);

  // State from database
  const [wishlist, setWishlist] = useState(propsWishlist || []);
  const [enquiries, setEnquiries] = useState([]);
  const [rentHistory, setRentHistory] = useState([]);
  const [rentSubscriptions, setRentSubscriptions] = useState([]); // Active recurring rentals

  // Fetch data on mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchUserData();
    }
  }, [currentUser]);

  // Sync with props wishlist
  useEffect(() => {
    if (propsWishlist) {
      setWishlist(propsWishlist);
    }
  }, [propsWishlist]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch wishlist from database
      const wishlistResult = await getUserWishlist(currentUser.id);
      if (wishlistResult.success && wishlistResult.data.length > 0) {
        setWishlist(wishlistResult.data);
      }

      // Fetch enquiries
      const enquiriesResult = await getUserEnquiries(currentUser.id);
      if (enquiriesResult.success) {
        setEnquiries(enquiriesResult.data);
      }

      // Fetch rent history
      const rentResult = await getUserRentHistory(currentUser.id);
      if (rentResult.success) {
        setRentHistory(rentResult.data);
      }

      // Fetch rent subscriptions
      const subscriptionsResult = await fetchUserRentSubscriptions(currentUser.id);
      if (subscriptionsResult.success) {
        setRentSubscriptions(subscriptionsResult.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clean up function to fetch payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const paymentsResult = await getUserPayments(currentUser.id);
      if (paymentsResult.success) {
        setPayments(Array.isArray(paymentsResult.data) ? paymentsResult.data : []);
      }
    } catch (err) {
      console.error("Error fetching payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchPayments();
    }
  }, [currentUser]);

  const [payments, setPayments] = useState([]);

  const handleRemoveFromWishlist = async (propertyId) => {
    if (propsRemoveFromWishlist) {
      propsRemoveFromWishlist(propertyId);
    }
    if (currentUser?.id) {
      try {
        await removeFromWishlistAPI(currentUser.id, propertyId);
        setWishlist(prev => prev.filter(p => p.id !== propertyId));
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      setWishlist(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  // Bulk Selection State
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Clear selection on tab change
  useEffect(() => {
    setSelectedItems(new Set());
  }, [activeTab]);

  const handleSelectAll = (items) => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.id)));
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) return;

    setLoading(true);
    try {
      const ids = Array.from(selectedItems);
      let apiCall;

      // Determine API based on active tab
      if (activeTab === 'enquiries') apiCall = import('../api/apiService').then(m => m.deleteEnquiry);
      else if (activeTab === 'rentals') apiCall = import('../api/apiService').then(m => m.deleteRentRequest); // Or delete rent history?
      else if (activeTab === 'payments') apiCall = import('../api/apiService').then(m => m.deletePayment);

      const deleteFunc = await apiCall;

      // Execute deletions (parallel)
      await Promise.all(ids.map(id => deleteFunc(id)));

      // Refresh data
      if (activeTab === 'enquiries') {
        const res = await getUserEnquiries(currentUser.id);
        if (res.success) setEnquiries(res.data);
      } else if (activeTab === 'rentals') {
        const res = await getUserRentHistory(currentUser.id);
        if (res.success) setRentHistory(res.data);
      } else if (activeTab === 'payments') {
        const res = await getUserPayments(currentUser.id);
        if (res.success) setPayments(res.data);
      }

      setSelectedItems(new Set());
      alert('Items deleted successfully');
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    wishlistCount: wishlist?.length || 0,
    enquiriesCount: enquiries.length,
    rentalsCount: rentHistory.filter(r => r.status === 'active').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="user-dashboard-page animate__animated animate__fadeIn" style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
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
              {/* Background decoration */}
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
                  <i className="bi bi-person-circle fs-1" style={{ color: 'var(--charcoal-slate)' }}></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-1" style={{ color: 'var(--primary-text)' }}>
                    My Dashboard
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    {currentUser?.email || 'Manage your properties and enquiries'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-4">
          <div className="dashboard-tabs">
            {[
              { id: 'overview', label: 'Overview', icon: 'bi-grid' },
              { id: 'wishlist', label: 'Wishlist', icon: 'bi-heart' },
              { id: 'enquiries', label: 'Enquiries', icon: 'bi-envelope' },
              { id: 'rentals', label: 'Rent History', icon: 'bi-house' },
              { id: 'payments', label: 'My Bookings & Payments', icon: 'bi-credit-card' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <TabLoading text={`Loading ${activeTab === 'overview' ? 'overview' : activeTab === 'wishlist' ? 'wishlist' : activeTab === 'enquiries' ? 'enquiries' : activeTab === 'rentals' ? 'rent history' : 'payments'}...`} />
        )}

        {/* Overview Tab */}
        {!loading && activeTab === 'overview' && (
          <div className="row g-4">
            {/* Stats Cards */}
            <div className="col-md-4">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-heart-fill fs-4" style={{ color: '#EF4444' }}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-white">{stats.wishlistCount}</h3>
                    <p className="text-white-50" style={{ margin: 0, fontSize: '0.9rem' }}>Saved Properties</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-envelope-fill fs-4" style={{ color: '#3B82F6' }}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-white">{stats.enquiriesCount}</h3>
                    <p className="text-white-50" style={{ margin: 0, fontSize: '0.9rem' }}>Active Enquiries</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-house-fill fs-4" style={{ color: '#10B981' }}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0 text-white">{stats.rentalsCount}</h3>
                    <p className="text-white-50" style={{ margin: 0, fontSize: '0.9rem' }}>Active Rentals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-12">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h5 className="fw-bold mb-4 text-white">Quick Actions</h5>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    onClick={() => navigate('/property-list')}
                    className="btn"
                    style={{
                      background: 'var(--construction-gold)',
                      color: '#0F172A',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none'
                    }}
                  >
                    <i className="bi bi-search me-2"></i>Browse Properties
                  </button>
                  <button
                    onClick={() => navigate('/compare-properties')}
                    className="btn btn-outline-light"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <i className="bi bi-arrow-left-right me-2"></i>Compare Properties
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className="btn btn-outline-light"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <i className="bi bi-heart me-2"></i>View Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-12">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h5 className="fw-bold mb-4 text-white">Recent Activity</h5>
                {wishlist.length === 0 && enquiries.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <i className="bi bi-clock-history fs-2 text-white-50"></i>
                    </div>
                    <h6 className="text-white">No recent activity</h6>
                    <p className="text-white-50" style={{ fontSize: '0.9rem' }}>
                      Start browsing properties to see your activity here
                    </p>
                    <button
                      onClick={() => navigate('/property-list')}
                      className="btn mt-2"
                      style={{
                        background: 'var(--construction-gold)',
                        color: '#0F172A',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        border: 'none'
                      }}
                    >
                      Explore Properties
                    </button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {wishlist.slice(0, 3).map((property) => (
                      <div className="col-md-4" key={property.id}>
                        <PropertyCard
                          property={property}
                          addToCompare={() => { }}
                          addToWishlist={() => { }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {!loading && activeTab === 'wishlist' && (
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: '#0F172A' }}>
                <i className="bi bi-heart me-2" style={{ color: '#EF4444' }}></i>
                Your Wishlist ({wishlist.length})
              </h5>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-5">
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #FEE2E220, #FEE2E210)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="bi bi-heart" style={{ fontSize: '3rem', color: '#F87171' }}></i>
                </div>
                <h5 style={{ color: '#0F172A' }}>Your wishlist is empty</h5>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  Save properties you like by clicking the heart icon to view them later
                </p>
                <button
                  onClick={() => navigate('/property-list')}
                  className="btn mt-3"
                  style={{
                    background: 'var(--construction-gold)',
                    color: '#0F172A',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none'
                  }}
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {wishlist.map((property) => (
                  <div className="col-lg-4 col-md-6" key={property.id}>
                    <div className="position-relative">
                      <PropertyCard
                        property={property}
                        addToCompare={() => { }}
                        addToWishlist={() => { }}
                      />
                      <button
                        onClick={() => handleRemoveFromWishlist(property.id)}
                        className="btn btn-danger position-absolute"
                        style={{
                          top: '10px',
                          right: '10px',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enquiries Tab */}
        {!loading && activeTab === 'enquiries' && (
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-white">
                <i className="bi bi-envelope me-2" style={{ color: '#3B82F6' }}></i>
                Your Enquiries ({enquiries.length})
              </h5>
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash me-2"></i>Delete Selected ({selectedItems.size})
                </button>
              )}
            </div>

            {enquiries.length === 0 ? (
              <div className="text-center py-5">
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="bi bi-envelope-open" style={{ fontSize: '3rem', color: '#60A5FA' }}></i>
                </div>
                <h5 className="text-white">No enquiries yet</h5>
                <p className="text-white-50" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  When you send enquiries for properties, they will appear here
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', background: 'transparent', color: '#fff' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', accentColor: '#C8A24A' }}
                          checked={selectedItems.size === enquiries.length && enquiries.length > 0}
                          onChange={() => handleSelectAll(enquiries)}
                        />
                      </th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Property</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Location</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Date</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enquiry => (
                      <tr key={enquiry.id}>
                        <td style={{ background: 'transparent' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', accentColor: '#C8A24A' }}
                            checked={selectedItems.has(enquiry.id)}
                            onChange={() => handleSelectItem(enquiry.id)}
                          />
                        </td>
                        <td style={{ background: 'transparent', color: '#fff', fontWeight: '500' }}>{enquiry.property?.title || 'Deleted Property'}</td>
                        <td style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)' }}>{enquiry.property?.city}, {enquiry.property?.locality}</td>
                        <td style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)' }}>{formatDate(enquiry.createdAt)}</td>
                        <td style={{ background: 'transparent' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: enquiry.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : enquiry.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: enquiry.status === 'approved' ? '#34D399' : enquiry.status === 'rejected' ? '#F87171' : '#FBBF24'
                          }}>
                            {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rent History Tab */}
        {!loading && activeTab === 'rentals' && (
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Subscriptions Section */}
            {rentSubscriptions.length > 0 && (
              <div className="mb-5">
                <h5 className="fw-bold mb-4 text-primary">
                  <i className="bi bi-clock-history me-2"></i>
                  Active Rentals & Payments
                </h5>
                <div className="row g-3">
                  {rentSubscriptions.map(sub => (
                    <div className="col-md-6" key={sub.id}>
                      <div className="p-3 border rounded shadow-sm" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold fs-5 text-white">{sub.property_name}</span>
                          <span className="badge bg-success">Active</span>
                        </div>
                        <p className="mb-1 text-white-50"><i className="bi bi-geo-alt me-1"></i>{sub.city}, {sub.area}</p>
                        <hr className="border-secondary" />
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <label className="text-white-50 small d-block">Monthly Rent</label>
                            <span className="fw-bold fs-5 text-warning">₹{sub.rent_amount}</span>
                          </div>
                          <div>
                            <label className="text-white-50 small d-block">Next Due</label>
                            <span className={`fw-bold ${new Date(sub.next_payment_due) <= new Date() ? 'text-danger' : 'text-white'}`}>
                              {formatDate(sub.next_payment_due)}
                            </span>
                          </div>
                          <button
                            className="btn btn-primary"
                            disabled={new Date(sub.next_payment_due) > new Date(new Date().setDate(new Date().getDate() + 30))}
                            onClick={async () => {
                              if (window.confirm(`Pay rent of ₹${sub.rent_amount} for ${sub.property_name}?`)) {
                                setLoading(true);
                                try {
                                  const res = await payRent(sub.id, sub.rent_amount);
                                  if (res.success) {
                                    alert('Rent paid successfully!');
                                    fetchUserData();
                                  } else {
                                    alert(res.error);
                                  }
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                          >
                            Pay Rent
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-white">
                <i className="bi bi-journal-text me-2" style={{ color: '#10B981' }}></i>
                Rent Requests History ({rentHistory.length})
              </h5>
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash me-2"></i>Delete Selected ({selectedItems.size})
                </button>
              )}
            </div>

            {/* Same Rent History Table as before */}
            {rentHistory.length === 0 ? (
              <div className="text-center py-5">
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="bi bi-house-check" style={{ fontSize: '3rem', color: '#34D399' }}></i>
                </div>
                <h5 className="text-white">No rental history</h5>
                <p className="text-white-50" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  Your rental agreements and history will appear here
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', background: 'transparent', color: '#fff' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', accentColor: '#C8A24A' }}
                          checked={selectedItems.size === rentHistory.length && rentHistory.length > 0}
                          onChange={() => handleSelectAll(rentHistory)}
                        />
                      </th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Property</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Start Date</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Amount</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentHistory.map(rent => (
                      <tr key={rent.id}>
                        <td style={{ background: 'transparent' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', accentColor: '#C8A24A' }}
                            checked={selectedItems.has(rent.id)}
                            onChange={() => handleSelectItem(rent.id)}
                          />
                        </td>
                        <td style={{ background: 'transparent', color: '#fff', fontWeight: '500' }}>{rent.property?.title || 'Deleted Property'}</td>
                        <td style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)' }}>{formatDate(rent.createdAt)}</td>
                        <td style={{ background: 'transparent', color: '#C8A24A', fontWeight: '600' }}>{rent.monthlyRent || '-'}</td>
                        <td style={{ background: 'transparent' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: rent.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                            color: rent.status === 'active' ? '#34D399' : '#94A3B8'
                          }}>
                            {rent.status ? (rent.status.charAt(0).toUpperCase() + rent.status.slice(1)) : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


        {/* Payments Tab */}
        {!loading && activeTab === 'payments' && (
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-white">
                <i className="bi bi-credit-card me-2" style={{ color: '#C8A24A' }}></i>
                My Bookings & Payments ({payments.length})
              </h5>
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash me-2"></i>Delete Selected ({selectedItems.size})
                </button>
              )}
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-5">
                <p style={{ color: '#D4A437' }}>No booking payments made yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', background: 'transparent', color: '#fff' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', accentColor: '#C8A24A' }}
                          checked={selectedItems.size === payments.length && payments.length > 0}
                          onChange={() => handleSelectAll(payments)}
                        />
                      </th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Property</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Date</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Booking Amount</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Remaining Amount</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Status</th>
                      <th style={{ background: 'transparent', color: '#fff', fontWeight: '600' }}>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(pay => (
                      <tr key={pay.id}>
                        <td style={{ background: 'transparent' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', accentColor: '#C8A24A' }}
                            checked={selectedItems.has(pay.id)}
                            onChange={() => handleSelectItem(pay.id)}
                          />
                        </td>
                        <td style={{ background: 'transparent', fontWeight: '500' }}>
                          {pay.property ? <Link to={`/property/${pay.property.id}`} className="text-decoration-none text-white">{pay.property.name || pay.property.title}</Link> : <span className="text-white-50">Property Deleted</span>}
                        </td>
                        <td style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)' }}>{formatDate(pay.createdAt)}</td>
                        <td style={{ background: 'transparent', color: '#10B981', fontWeight: '600' }}>₹{pay.amount}</td>
                        <td style={{ background: 'transparent', color: '#F87171', fontWeight: 'bold' }}>₹{pay.remainingAmount}</td>
                        <td style={{ background: 'transparent' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: pay.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: pay.status === 'SUCCESS' ? '#34D399' : '#F87171'
                          }}>
                            {pay.status}
                          </span>
                        </td>
                        <td style={{ background: 'transparent' }}>
                          {pay.pdfUrl ? (
                            <a href={pay.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" title="Download Receipt" style={{ borderColor: 'rgba(59, 130, 246, 0.5)', color: '#60A5FA' }}>
                              <i className="bi bi-file-earmark-arrow-down"></i>
                            </a>
                          ) : (
                            <span className="text-white-50 small">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
