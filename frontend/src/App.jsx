import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';

import Dashboard from './components/dashboard/Dashboard';
import CropForm from './components/features/CropRecommendation/CropForm';
import ImageUpload from './components/features/DiseaseDetection/ImageUpload';
import AdvisoryGenerator from './components/features/Advisory/AdvisoryGenerator';
import SchemesForm from './components/features/SchemesMatcher/SchemesForm';
import UserProfile from './components/features/Profile/UserProfile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div style={{ color: '#ffffff', padding: '40px', textAlign: 'center' }}>Loading KisanAI Platform...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Auth Layout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
            </Route>

            {/* Main Protected Application */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/crop-recommendation" element={<ProtectedRoute><CropForm /></ProtectedRoute>} />
              <Route path="/disease-detection" element={<ProtectedRoute><ImageUpload /></ProtectedRoute>} />
              <Route path="/advisory" element={<ProtectedRoute><AdvisoryGenerator /></ProtectedRoute>} />
              <Route path="/schemes" element={<ProtectedRoute><SchemesForm /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
