import React from 'react';
import { format } from 'date-fns';

function AdminChoreList({ chores, masterChores, familyMembers }) {
  if (!chores || chores.length === 0) {
    return <div>No chores to display.</div>;
  }

  return (
    <div className="admin-chore-list">
      <h3>All Assigned Chores</h3>
      <table className="admin-chore-table">
        <thead className="admin-table-header">
          <tr>
            <th>Chore</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {chores.map((chore) => {
            const masterChore = masterChores.find(mc => mc.id === chore.masterChoreId);
            const assignee = familyMembers.find(member => member.id === chore.assigneeId);
            return (
              <tr key={chore.id}>
                <td>{masterChore ? masterChore.name : 'Unknown Chore'}</td>
                <td>{assignee ? assignee.name : 'Unassigned'}</td>
                <td>{chore.dueDate ? format(chore.dueDate.toDate(), 'PPP') : 'No Due Date'}</td>
                <td>{chore.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminChoreList;
