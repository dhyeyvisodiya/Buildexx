import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import CompareProperties from './pages/CompareProperties'
import Wishlist from './pages/Wishlist'
import UserDashboard from './pages/UserDashboard'
import BuilderDashboard from './pages/BuilderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth()

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
  const location = useLocation()

  // Helper for components that might still try to call navigateTo (backward compat or easy refactor)
  const navigate = useNavigate()

  const addToCompare = (property) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === property.id)) {
      setCompareList([...compareList, property])
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

          <Route path="/compare" element={<CompareProperties compareList={compareList} removeFromCompare={removeFromCompare} />} />
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
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App