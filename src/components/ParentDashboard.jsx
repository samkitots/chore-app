import React, { useState } from 'react';
import ChoreForm from './ChoreForm';
import AdminChoreList from './AdminChoreList';
import UnassignedChoreList from './UnassignedChoreList';
import PendingApprovalList from './PendingApprovalList';
import FamilyStatsList from './FamilyStatsList';

// ParentDashboard now receives all its data via props
function ParentDashboard({ currentUser, masterChores, familyMembers, chores }) {
  const [editingChore, setEditingChore] = useState(null);

  const startEditingChore = (chore) => setEditingChore(chore);
  const cancelEditing = () => setEditingChore(null);

  return (
    <div className="dashboard">
      <h1>Parent Dashboard</h1>
      <ChoreForm
        familyId={currentUser.familyId}
        familyMembers={familyMembers}
        masterChores={masterChores}
        editingChore={editingChore}
        setEditingChore={setEditingChore}
        cancelEditing={cancelEditing}
      />
      {/* Pass the required props to each child component */}
      <AdminChoreList chores={chores} masterChores={masterChores} familyMembers={familyMembers} />
      <UnassignedChoreList chores={chores} masterChores={masterChores} />
      <PendingApprovalList chores={chores} masterChores={masterChores} familyMembers={familyMembers} />
      <FamilyStatsList chores={chores} familyMembers={familyMembers} />
    </div>
  );
}

export default ParentDashboard;
