import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectRole from './pages/SelectRole';
import Dashboard from './pages/Dashboard';
import Mentors from './pages/Mentors';
import Profile from './pages/Profile';
import Sessions from './pages/Sessions';
import Chat from './pages/Chat';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Logout from './pages/Logout';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-600 text-gray-100">
      <Navbar />
      <main className="relative">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/profile/:id" element={<Profile />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/chat/:userId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/logout" element={<Logout />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#f1f5f9',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(16px)',
          },
          success: {
            iconTheme: {
              primary: '#00d4ff',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#f472b6',
              secondary: '#0f172a',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
