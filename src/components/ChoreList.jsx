import React, { useState } from 'react';
import { format, isToday, isPast, isFuture, differenceInDays } from 'date-fns';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

function ChoreList({ chores, masterChores, user }) {
  const [loading, setLoading] = useState(null); // Will store the ID of the chore being updated

  const markComplete = async (choreId) => {
    setLoading(choreId);
    const db = getFirestore();
    const choreRef = doc(db, 'chores', choreId);
    try {
      await updateDoc(choreRef, {
        status: 'pending_approval',
        completionDate: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error marking chore as complete: ", error);
      // Optionally, show an error message to the user
    } finally {
      setLoading(null);
    }
  };

  const getContextualDueDate = (dueDate) => {
    if (!dueDate?.toDate) return null;
    const dueDateObj = dueDate.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    
    const diffDays = differenceInDays(dueDateObj, today);

    if (isToday(dueDateObj)) return 'Due Today';
    if (isPast(dueDateObj)) return 'Overdue';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays > 1 && diffDays < 7) return `Due in ${diffDays} days`;
    return format(dueDateObj, 'PPP');
  };

  const userChores = chores.filter(chore => chore.assigneeId === user.uid && chore.status === 'assigned');

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">My Chores</h2>
      {userChores.length === 0 ? (
        <p className="text-gray-500">No chores assigned to you.</p>
      ) : (
        <div className="space-y-4">
          {userChores.map((chore) => {
            const masterChore = masterChores.find(mc => mc.id === chore.masterChoreId);
            const isLoading = loading === chore.id;
            return (
              <div key={chore.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{masterChore ? masterChore.name : 'Unknown Chore'}</h3>
                  <p className="text-sm text-gray-600">{masterChore?.description}</p>
                  <span className={`text-sm font-medium ${isPast(chore.dueDate?.toDate()) ? 'text-red-500' : 'text-gray-500'}`}>
                    {getContextualDueDate(chore.dueDate)}
                  </span>
                </div>
                <button 
                  onClick={() => markComplete(chore.id)} 
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-green-300"
                >
                  {isLoading ? '...' : 'Mark Complete'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChoreList;