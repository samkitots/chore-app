import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navigation() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navigation">
      <div className="navigation-brand">
        <Link to={currentUser ? "/dashboard" : "/login"}>ChoreRotator</Link>
      </div>
      <div className="navigation-links">
        {currentUser && (
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {currentUser.role === 'admin' && (
              <li><Link to="/admin">Admin</Link></li>
            )}
          </ul>
        )}
      </div>
      <div className="navigation-user">
        {currentUser ? (
          <>
            <span className="user-greeting">Hello, {currentUser.name || currentUser.email}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
