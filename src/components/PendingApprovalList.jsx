import React from 'react';
import { format } from 'date-fns';
import { db, doc, updateDoc, Timestamp } from '../firebase';

function PendingApprovalList({ chores, masterChores, familyMembers }) {

  const calculateNextDueDate = (currentDueDate, frequency) => {
    const baseDate = currentDueDate ? currentDueDate.toDate() : new Date();
    const nextDueDate = new Date(baseDate);
    switch (frequency) {
      case 'Daily': nextDueDate.setDate(baseDate.getDate() + 1); break;
      case 'Weekly': nextDueDate.setDate(baseDate.getDate() + 7); break;
      case 'Fortnightly': nextDueDate.setDate(baseDate.getDate() + 14); break;
      case 'Monthly': nextDueDate.setMonth(baseDate.getMonth() + 1); break;
      default: return null;
    }
    return Timestamp.fromDate(nextDueDate);
  };

  const approveChore = async (chore) => {
    const choreRef = doc(db, 'chores', chore.id);
    const nextDueDate = calculateNextDueDate(chore.dueDate, chore.frequency);
    await updateDoc(choreRef, {
      status: 'completed',
      isCompleted: true,
      dueDate: nextDueDate,
    });
  };

  const pendingChores = chores.filter(chore => chore.status === 'pending_approval');

  return (
    <div className="pending-approval-section">
      <h3>Pending Approval</h3>
      {pendingChores.length === 0 ? (
        <p>No chores pending approval.</p>
      ) : (
        <ul>
          {pendingChores.map((chore) => {
            const masterChore = masterChores.find(mc => mc.id === chore.masterChoreId);
            const completedBy = familyMembers.find(member => member.id === chore.assigneeId);
            return (
              <li key={chore.id} className="pending-chore-item">
                <span>{masterChore ? masterChore.name : 'Unknown Chore'} completed by {completedBy ? completedBy.name : 'Unknown Member'} on {chore.completionDate ? format(chore.completionDate.toDate(), 'PPP') : 'Unknown Date'}</span>
                <button onClick={() => approveChore(chore)}>Approve</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PendingApprovalList;
