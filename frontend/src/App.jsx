import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthEntry from './pages/AuthEntry';
import Home from './pages/Home';
import VehicleDetail from './pages/VehicleDetail';
import SellerDashboard from './pages/SellerDashboard';
import VehicleForm from './pages/VehicleForm';
import ImageManager from './pages/ImageManager';
import AdminDashboard from './pages/AdminDashboard';
import Favorites from './pages/Favorites';
import BuyerRequests from './pages/BuyerRequests';
import SellerRequests from './pages/SellerRequests';
import Notifications from './pages/Notifications';
import { BrandLoadingScreen } from './components/LoadingSkeleton';

// Protected Route for Buyer
const BuyerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <BrandLoadingScreen message="Verifying buyer session..." />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role !== 'BUYER') return <Navigate to="/" replace />;
  return children;
};

// Protected Route for Seller
const SellerRoute = ({ children }) => {
  const { isAuthenticated, user, isSeller, loading } = useAuth();
  if (loading) return <BrandLoadingScreen message="Verifying seller session..." />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role === 'BUYER') return <Navigate to="/buyer/dashboard" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (!isSeller) return <Navigate to="/" replace />;
  return children;
};

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isAdmin, loading } = useAuth();
  if (loading) return <BrandLoadingScreen message="Verifying administrative access..." />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role === 'BUYER') return <Navigate to="/buyer/dashboard" replace />;
  if (user?.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Protected Route for any authenticated user
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <BrandLoadingScreen message="Verifying credentials..." />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// Root Route Gateway: Redirects to role dashboard if authenticated, else shows AuthEntry
const RootRouteHandler = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <BrandLoadingScreen message="Initializing MOLO..." />;
  if (isAuthenticated && user) {
    if (user.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/buyer/dashboard" replace />;
  }
  return <AuthEntry />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Root Gateway */}
              <Route path="/" element={<RootRouteHandler />} />
              <Route path="/login" element={<AuthEntry defaultMode="login" />} />
              <Route path="/register" element={<AuthEntry defaultMode="register" />} />

              {/* Protected Buyer Routes */}
              <Route 
                path="/buyer/dashboard" 
                element={
                  <BuyerRoute>
                    <Home />
                  </BuyerRoute>
                } 
              />
              <Route 
                path="/vehicles/:id" 
                element={
                  <BuyerRoute>
                    <VehicleDetail />
                  </BuyerRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <BuyerRoute>
                    <Favorites />
                  </BuyerRoute>
                } 
              />
              <Route 
                path="/requests/buyer" 
                element={
                  <BuyerRoute>
                    <BuyerRequests />
                  </BuyerRoute>
                } 
              />

              {/* Protected Seller Routes */}
              <Route 
                path="/seller/dashboard" 
                element={
                  <SellerRoute>
                    <SellerDashboard />
                  </SellerRoute>
                } 
              />
              <Route 
                path="/seller/vehicles/new" 
                element={
                  <SellerRoute>
                    <VehicleForm />
                  </SellerRoute>
                } 
              />
              <Route 
                path="/seller/vehicles/:id/edit" 
                element={
                  <SellerRoute>
                    <VehicleForm />
                  </SellerRoute>
                } 
              />
              <Route 
                path="/seller/vehicles/:id/images" 
                element={
                  <SellerRoute>
                    <ImageManager />
                  </SellerRoute>
                } 
              />
              <Route 
                path="/requests/seller" 
                element={
                  <SellerRoute>
                    <SellerRequests />
                  </SellerRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              {/* Protected General Alerts */}
              <Route 
                path="/notifications" 
                element={
                  <AuthenticatedRoute>
                    <Notifications />
                  </AuthenticatedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
