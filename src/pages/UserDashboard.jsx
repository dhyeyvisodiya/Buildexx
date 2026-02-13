import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #EF444420, #EF444410)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-heart-fill fs-4" style={{ color: '#EF4444' }}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: '#0F172A' }}>{stats.wishlistCount}</h3>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>Saved Properties</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #3B82F620, #3B82F610)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-envelope-fill fs-4" style={{ color: '#3B82F6' }}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: '#0F172A' }}>{stats.enquiriesCount}</h3>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>Active Enquiries</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #10B98120, #10B98110)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-house-fill fs-4" style={{ color: '#10B981' }}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: '#0F172A' }}>{stats.rentalsCount}</h3>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>Active Rentals</p>
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
                border: 'none',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-text)' }}>Quick Actions</h5>
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
                    <i className="bi bi-arrow-left-right me-2"></i>Compare Properties
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
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
                border: 'none',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-text)' }}>Recent Activity</h5>
                {wishlist.length === 0 && enquiries.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: '#F1F5F9',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <i className="bi bi-clock-history fs-2" style={{ color: '#94A3B8' }}></i>
                    </div>
                    <h6 style={{ color: '#64748B' }}>No recent activity</h6>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
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
            border: '1px solid #E2E8F0'
          }}>
            <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
              <i className="bi bi-envelope me-2" style={{ color: '#3B82F6' }}></i>
              Your Enquiries ({enquiries.length})
            </h5>

            {enquiries.length === 0 ? (
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
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  When you send enquiries for properties, they will appear here
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Location</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enquiry => (
                      <tr key={enquiry.id}>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{enquiry.property?.title || 'Deleted Property'}</td>
                        <td style={{ color: '#64748B' }}>{enquiry.property?.city}, {enquiry.property?.locality}</td>
                        <td style={{ color: '#64748B' }}>{formatDate(enquiry.createdAt)}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: enquiry.status === 'approved' ? '#D1FAE5' : enquiry.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                            color: enquiry.status === 'approved' ? '#059669' : enquiry.status === 'rejected' ? '#DC2626' : '#D97706'
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
            border: '1px solid #E2E8F0'
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
                      <div className="p-3 border rounded shadow-sm bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold fs-5">{sub.property_name}</span>
                          <span className="badge bg-success">Active</span>
                        </div>
                        <p className="mb-1 text-muted"><i className="bi bi-geo-alt me-1"></i>{sub.city}, {sub.area}</p>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <label className="text-muted small d-block">Monthly Rent</label>
                            <span className="fw-bold text-dark fs-5">₹{sub.rent_amount}</span>
                          </div>
                          <div>
                            <label className="text-muted small d-block">Next Due</label>
                            <span className={`fw-bold ${new Date(sub.next_payment_due) <= new Date() ? 'text-danger' : 'text-dark'}`}>
                              {formatDate(sub.next_payment_due)}
                            </span>
                          </div>
                          <button
                            className="btn btn-primary"
                            disabled={new Date(sub.next_payment_due) > new Date(new Date().setDate(new Date().getDate() + 30))} // Disable if far in future? No, user requested "active every month".
                            // Activating if needed. But user said "every month the button should be active".
                            // Let's just allow it always, and logic moves date forward.
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

            <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
              <i className="bi bi-journal-text me-2" style={{ color: '#10B981' }}></i>
              Rent Requests History ({rentHistory.length})
            </h5>

            {/* Same Rent History Table as before */}
            {rentHistory.length === 0 ? (
              <div className="text-center py-5">
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #D1FAE520, #D1FAE510)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="bi bi-house-check" style={{ fontSize: '3rem', color: '#34D399' }}></i>
                </div>
                <h5 style={{ color: '#0F172A' }}>No rental history</h5>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                  Your rental agreements and history will appear here
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Start Date</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Amount</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentHistory.map(rent => (
                      <tr key={rent.id}>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{rent.property?.title || 'Deleted Property'}</td>
                        <td style={{ color: '#64748B' }}>{formatDate(rent.createdAt)}</td>
                        <td style={{ color: '#C8A24A', fontWeight: '600' }}>{rent.monthlyRent || '-'}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: rent.status === 'active' ? '#D1FAE5' : '#F1F5F9',
                            color: rent.status === 'active' ? '#059669' : '#64748B'
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
            border: '1px solid #E2E8F0'
          }}>
            <h5 className="fw-bold mb-4" style={{ color: '#0F172A' }}>
              <i className="bi bi-credit-card me-2" style={{ color: '#C8A24A' }}></i>
              My Bookings & Payments ({payments.length})
            </h5>

            {payments.length === 0 ? (
              <div className="text-center py-5">
                <p className="style={{ color: '#D4A437' }}">No booking payments made yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Property</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Date</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Booking Amount</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Remaining Amount</th>
                      <th style={{ color: '#0F172A', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(pay => (
                      <tr key={pay.id}>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{pay.property ? pay.property.title : 'Property Deleted'}</td>
                        <td style={{ color: '#64748B' }}>{formatDate(pay.createdAt)}</td>
                        <td style={{ color: '#10B981', fontWeight: '600' }}>₹{pay.amount}</td>
                        <td style={{ color: '#DC2626', fontWeight: 'bold' }}>₹{pay.remainingAmount}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: pay.status === 'SUCCESS' ? '#D1FAE5' : '#FEE2E2',
                            color: pay.status === 'SUCCESS' ? '#059669' : '#DC2626'
                          }}>
                            {pay.status}
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
      </div>
    </div>
  );
};

export default UserDashboard;
