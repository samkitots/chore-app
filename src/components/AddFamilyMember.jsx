import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useAuth } from './AuthContext';

const AddFamilyMember = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { currentUser } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser?.familyId) {
        setError("Could not determine your family ID. Please try again.");
        return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // 1. Add a document to Firestore in the 'familyMembers' collection
      await addDoc(collection(db, "familyMembers"), {
        name: name,
        email: email,
        role: role,
        familyId: currentUser.familyId, // Associate with the current user's family
        // userId will be added later when the user signs up
      });

      // 2. Send an invitation email (which works like a password reset for new users)
      await sendPasswordResetEmail(auth, email);

      setMessage(`An invitation has been sent to ${email}.`);
      // Optionally, clear the form
      setName('');
      setEmail('');
      setRole('Member');
      
      // Navigate back after a delay
      setTimeout(() => navigate('/parent-dashboard'), 3000);

    } catch (error) {
      console.error('Error adding family member:', error);
      setError('Failed to add family member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/parent-dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Family Member</h2>
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
      {message && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</p>}
      <form onSubmit={handleSave} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Family Member Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Family Member Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="Parent">Parent</option>
            <option value="Member">Member</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending Invitation...' : 'Save & Send Invitation'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFamilyMember;