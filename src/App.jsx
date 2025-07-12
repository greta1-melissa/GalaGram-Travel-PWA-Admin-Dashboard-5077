import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PWAProvider } from './contexts/PWAContext';
import { AdminProvider } from './contexts/AdminContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Destinations from './pages/Destinations';
import ExploreLocation from './pages/ExploreLocation'; // Add this line
import Itinerary from './pages/Itinerary';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import UpdateNotification from './components/UpdateNotification';
import AIChat from './components/AIChat';

import './App.css';

function App() {
  return (
    <PWAProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <div className="app">
              <Toaster position="top-right" />
              <InstallPrompt />
              <UpdateNotification />
              <AIChat />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="search" element={<Search />} />
                  <Route path="destinations" element={<Destinations />} />
                  <Route path="explore/:locationId" element={<ExploreLocation />} /> {/* Add this line */}
                  <Route
                    path="itinerary"
                    element={
                      <ProtectedRoute>
                        <Itinerary />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="reviews" element={<Reviews />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </AdminProvider>
      </AuthProvider>
    </PWAProvider>
  );
}

export default App;