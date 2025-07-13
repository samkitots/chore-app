import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getAuth, signOut } from 'firebase/auth';

function Navigation() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Assuming 'Parent' is the admin role
  const isAdmin = currentUser?.role === 'Parent';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={currentUser ? "/dashboard" : "/login"} className="text-xl font-bold text-gray-800">
          ChoreRotator
        </Link>
        <div className="flex items-center">
          {currentUser && (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
              {isAdmin && (
                <Link to="/add-chore" className="text-gray-600 hover:text-gray-800">Add Chore</Link>
              )}
               {isAdmin && (
                <Link to="/add-family-member" className="text-gray-600 hover:text-gray-800">Add Family Member</Link>
              )}
            </div>
          )}
          <div className="ml-6">
            {currentUser ? (
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Hello, {currentUser.name || currentUser.email}</span>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;