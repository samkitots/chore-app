import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

function AddNewChore() {
  const [choreName, setChoreName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!choreName.trim()) {
      alert('Please enter a chore name.');
      return;
    }

    try {
      await addDoc(collection(db, 'masterChores'), {
        name: choreName,
        frequency: frequency,
        familyId: currentUser.familyId,
        createdAt: serverTimestamp(),
      });
      navigate('/dashboard');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to add chore. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Chore</h2>
      <form onSubmit={handleSave} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <label htmlFor="choreName" className="block text-sm font-medium text-gray-700">Chore Name</label>
          <input
            type="text"
            id="choreName"
            value={choreName}
            onChange={(e) => setChoreName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewChore;
