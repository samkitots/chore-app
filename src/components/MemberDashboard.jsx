import React from 'react';
import ChoreList from './ChoreList';
import FamilyStatsList from './FamilyStatsList';

// MemberDashboard receives all its data via props
function MemberDashboard({ currentUser, masterChores, familyMembers, chores }) {
  return (
    <div className="dashboard">
      <h1>Member Dashboard</h1>
      {/* Pass the required props to each child component */}
      <ChoreList
        chores={chores}
        masterChores={masterChores}
        user={currentUser}
      />
      <FamilyStatsList
        chores={chores}
        familyMembers={familyMembers}
      />
    </div>
  );
}

export default MemberDashboard;
