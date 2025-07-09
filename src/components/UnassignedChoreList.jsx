import React from 'react';

function UnassignedChoreList({ chores, masterChores }) {
  const assignedMasterChoreIds = new Set(chores.map(chore => chore.masterChoreId));
  const unassignedChores = masterChores.filter(masterChore => !assignedMasterChoreIds.has(masterChore.id));

  return (
    <div className="unassigned-chores-section">
      <h3>Chores Needing Assignment</h3>
      {unassignedChores.length === 0 ? (
        <p>All master chores are currently assigned.</p>
      ) : (
        <ul>
          {unassignedChores.map((chore) => (
            <li key={chore.id} className="unassigned-chore-item">
              {chore.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UnassignedChoreList;
