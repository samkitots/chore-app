import React from 'react';
import { Link } from 'react-router-dom';
import ChoreManagementList from './ChoreManagementList';
import PendingApprovalList from './PendingApprovalList';
import FamilyStatsList from './FamilyStatsList';
import { useAuth } from './AuthContext';

function ParentDashboard({ chores, familyMembers, masterChores }) {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {currentUser?.name || 'Parent'}!</h1>
        <div className="flex space-x-4">
          <Link to="/add-new-chore" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add New Chore
          </Link>
          <Link to="/add-family-member" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Add Family Member
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <ChoreManagementList chores={chores} familyMembers={familyMembers} masterChores={masterChores} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PendingApprovalList chores={chores} masterChores={masterChores} />
        </div>
        <div>
          <FamilyStatsList chores={chores} familyMembers={familyMembers} />
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;