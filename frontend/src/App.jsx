import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleDetail from './pages/VehicleDetail';
import SellerDashboard from './pages/SellerDashboard';
import VehicleForm from './pages/VehicleForm';
import ImageManager from './pages/ImageManager';
import AdminDashboard from './pages/AdminDashboard';
import Favorites from './pages/Favorites';
import BuyerRequests from './pages/BuyerRequests';
import SellerRequests from './pages/SellerRequests';
import Notifications from './pages/Notifications';

// Protected Route for Seller
const SellerRoute = ({ children }) => {
  const { isAuthenticated, isSeller, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Verifying credentials...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isSeller) return <Navigate to="/" replace />;
  return children;
};

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Verifying credentials...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Protected Route for any authenticated user
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Verifying credentials...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />

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

              {/* Protected Buyer Routes */}
              <Route 
                path="/favorites" 
                element={
                  <AuthenticatedRoute>
                    <Favorites />
                  </AuthenticatedRoute>
                } 
              />
              <Route 
                path="/requests/buyer" 
                element={
                  <AuthenticatedRoute>
                    <BuyerRequests />
                  </AuthenticatedRoute>
                } 
              />

              {/* Protected Seller Request Routes */}
              <Route 
                path="/requests/seller" 
                element={
                  <SellerRoute>
                    <SellerRequests />
                  </SellerRoute>
                } 
              />

              {/* Protected General Auth Routes */}
              <Route 
                path="/notifications" 
                element={
                  <AuthenticatedRoute>
                    <Notifications />
                  </AuthenticatedRoute>
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

              {/* Redirect any other path to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
