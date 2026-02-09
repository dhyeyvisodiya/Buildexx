import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import ComparePropertiesPage from './pages/CompareProperties'
import ComparePropertiesModal from './components/CompareProperties'
import Wishlist from './pages/Wishlist'
import UserDashboard from './pages/UserDashboard'
import BuilderDashboard from './pages/BuilderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { initializeDatabase } from '../api/db'
import { Toaster } from 'react-hot-toast'


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isInitializing } = useAuth()

  // Wait for auth initialization to complete before making any redirects
  if (isInitializing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(200,162,74,0.2)',
          borderTop: '4px solid #C8A24A',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on actual role
    if (currentUser.role === 'admin') return <Navigate to="/admin-dashboard" replace />
    if (currentUser.role === 'builder') return <Navigate to="/builder-dashboard" replace />
    return <Navigate to="/user-dashboard" replace />
  }

  return children
}

function AppContent() {
  const [compareList, setCompareList] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)
  const location = useLocation()

  // Helper for components that might still try to call navigateTo (backward compat or easy refactor)
  const navigate = useNavigate()

  const addToCompare = (property) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === property.id)) {
      setCompareList([...compareList, property])
    } else if (compareList.length >= 3) {
      // Show a brief notification
      alert('You can compare up to 3 properties at a time')
    }
  }

  const removeFromCompare = (propertyId) => {
    setCompareList(compareList.filter(p => p.id !== propertyId))
  }

  const addToWishlist = (property) => {
    if (!wishlist.find(p => p.id === property.id)) {
      setWishlist([...wishlist, property])
    }
  }

  const removeFromWishlist = (propertyId) => {
    setWishlist(wishlist.filter(p => p.id !== propertyId))
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        currentPage={location.pathname}
        compareCount={compareList.length}
        wishlistCount={wishlist.length}
      />
      <main style={{ flex: '1' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property-list" element={<PropertyList addToCompare={addToCompare} addToWishlist={addToWishlist} />} />
          <Route path="/properties" element={<PropertyList addToCompare={addToCompare} addToWishlist={addToWishlist} />} />
          <Route path="/property/:id" element={<PropertyDetail addToCompare={addToCompare} addToWishlist={addToWishlist} />} />

          <Route path="/compare" element={<ComparePropertiesPage compareList={compareList} removeFromCompare={removeFromCompare} />} />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserDashboard wishlist={wishlist} />
            </ProtectedRoute>
          } />

          <Route path="/builder-dashboard" element={
            <ProtectedRoute allowedRoles={['builder', 'admin']}>
              <BuilderDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />

      {/* Floating Compare Tray */}
      {compareList.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #112A46, #0F1E33)',
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(200, 162, 74, 0.3)',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {compareList.map((prop) => (
              <div key={prop.id} style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                border: '2px solid rgba(200, 162, 74, 0.5)'
              }}>
                {prop.images && prop.images[0] ? (
                  <img src={prop.images[0]} alt={prop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-building" style={{ color: '#64748B' }}></i>
                  </div>
                )}
                <button
                  onClick={() => removeFromCompare(prop.id)}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '18px',
                    height: '18px',
                    background: '#EF4444',
                    border: 'none',
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))}
            {/* Empty slots */}
            {[...Array(3 - compareList.length)].map((_, i) => (
              <div key={`empty-${i}`} style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                border: '2px dashed rgba(100, 116, 139, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-plus" style={{ color: '#64748B' }}></i>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowCompareModal(true)}
            disabled={compareList.length < 2}
            style={{
              background: compareList.length >= 2 ? 'linear-gradient(135deg, #C8A24A, #9E7C2F)' : '#374151',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              color: compareList.length >= 2 ? '#0F172A' : '#64748B',
              fontWeight: '700',
              cursor: compareList.length >= 2 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="bi bi-layout-split"></i>
            Compare ({compareList.length}/3)
          </button>
        </div>
      )}

      {/* Compare Properties Modal */}
      <ComparePropertiesModal
        isOpen={showCompareModal}
        properties={compareList}
        onRemove={removeFromCompare}
        onClose={() => setShowCompareModal(false)}
      />
    </div>
  )
}

function App() {
  useEffect(() => {
    // Run database migrations/initialization on app start
    initializeDatabase().catch(console.error);
  }, []);

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#fff',
            border: '1px solid #334155'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App