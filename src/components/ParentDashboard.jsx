import React from 'react';
import { Link } from 'react-router-dom';
import ChoreManagementList from './ChoreManagementList';
import PendingApprovalList from './PendingApprovalList';
import FamilyStatsList from './FamilyStatsList';

// ParentDashboard now receives all its data via props
function ParentDashboard({ currentUser, chores, familyMembers, masterChores }) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <Link to="/add-chore" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Chore
        </Link>
      </div>

      {/* Chore Management table takes full width */}
      <ChoreManagementList />

      {/* Two-column layout for ancillary lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
          <PendingApprovalList chores={chores} masterChores={masterChores} familyMembers={familyMembers} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Family Stats</h2>
          <FamilyStatsList chores={chores} familyMembers={familyMembers} />
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
