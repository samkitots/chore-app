import React from 'react';
import ChoreList from './ChoreList';
import FamilyStatsList from './FamilyStatsList';
import { useAuth } from './AuthContext'; // Import useAuth to access the current user

function MemberDashboard({ masterChores, familyMembers, chores }) {
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  if (!currentUser) {
    return <div>Loading...</div>; // Or some other loading state
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser.name || 'Member'}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChoreList
            chores={chores}
            masterChores={masterChores}
            user={currentUser}
          />
        </div>
        <div>
          <FamilyStatsList
            chores={chores}
            familyMembers={familyMembers}
          />
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;