import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import AddNewChore from './components/AddNewChore'; // Import the new component

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <AuthenticatedApp />
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { currentUser } = useAuth();

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/login" element={!currentUser ? <AuthForm /> : <Navigate to="/dashboard" />} />
        
        {/* Main dashboard route for all logged-in users */}
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
        
        {/* Route for adding a new chore, only accessible by admins */}
        <Route path="/add-chore" element={currentUser && currentUser.role === 'admin' ? <AddNewChore /> : <Navigate to="/dashboard" />} />

        {/* Admin-specific route, redirects to the main dashboard if not an admin */}
        <Route 
          path="/admin" 
          element={currentUser && currentUser.role === 'admin' ? <Dashboard /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Default route redirects to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
