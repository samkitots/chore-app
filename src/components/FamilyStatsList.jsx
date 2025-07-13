import React from 'react';

function FamilyStatsList({ chores, familyMembers }) {
  const familyMemberStats = familyMembers
    .filter(member => member.userId) // Only include members who have a userId
    .map(member => {
        const choresCompleted = chores.filter(chore => 
            chore.assigneeId === member.userId && chore.status === 'completed'
        ).length;

        return {
            id: member.id,
            name: member.name,
            completedCount: choresCompleted,
        };
    });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Family Stats: Chores Completed</h3>
      {familyMemberStats.length === 0 ? (
        <p className="text-gray-500">No stats to display. Members must complete chores to see stats.</p>
      ) : (
        <ul className="space-y-4">
          {familyMemberStats
            .sort((a, b) => b.completedCount - a.completedCount)
            .map(memberStats => (
              <li key={memberStats.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-800">{memberStats.name}</span>
                <span className="font-semibold text-lg text-green-600">{memberStats.completedCount}</span>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FamilyStatsList;