import React from 'react';
import { format, isToday, isPast, isFuture, differenceInDays } from 'date-fns';
import { db, doc, updateDoc, serverTimestamp } from '../firebase';

function ChoreList({ chores, masterChores, user }) {

  const markComplete = async (choreId) => {
    const choreRef = doc(db, 'chores', choreId);
    await updateDoc(choreRef, {
      status: 'pending_approval',
      completionDate: serverTimestamp(),
    });
  };

  const getContextualDueDate = (dueDate) => {
    if (!dueDate) return null;
    const dueDateObj = dueDate.toDate();
    const today = new Date();
    const diffDays = differenceInDays(dueDateObj, today);
    if (isToday(dueDateObj)) return 'Due Today';
    if (isPast(dueDateObj) && !isToday(dueDateObj)) return 'Overdue';
    if (isFuture(dueDateObj)) {
      if (diffDays === 1) return 'Due Tomorrow';
      if (diffDays < 7) return `Due in ${diffDays} days`;
    }
    return format(dueDateObj, 'PPP');
  };

  const userChores = chores.filter(chore => chore.assigneeId === user.uid && chore.status === 'assigned');

  return (
    <div className="chore-list">
      <h2>My Chores</h2>
      {userChores.length === 0 ? (
        <p>No chores assigned to you.</p>
      ) : (
        <div className="chore-grid">
          {userChores.map((chore) => {
            const masterChore = masterChores.find(mc => mc.id === chore.masterChoreId);
            return (
              <div key={chore.id} className="chore-item">
                <div className="chore-header">
                  <span>{masterChore ? masterChore.name : 'Unknown Chore'}</span>
                  <span className={`due-status ${getContextualDueDate(chore.dueDate)?.toLowerCase().replace(/ /g, '-')}`}>
                    {getContextualDueDate(chore.dueDate)}
                  </span>
                </div>
                <p>{masterChore ? masterChore.description : ''}</p>
                <button onClick={() => markComplete(chore.id)}>Mark Complete</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChoreList;
