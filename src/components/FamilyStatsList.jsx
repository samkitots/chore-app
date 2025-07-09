import React from 'react';

function FamilyStatsList({ chores, familyMembers }) {
  const familyMemberStats = familyMembers.map(member => {
    const completedCount = chores.filter(chore => chore.assigneeId === member.id && chore.status === 'completed').length;
    return {
      id: member.id,
      name: member.name,
      completedCount,
    };
  });

  return (
    <div className="family-stats"> {/* FIX: Changed className to match App.css */}
      <h3>Family Stats</h3>
      {familyMemberStats.length === 0 ? (
        <p>No family members or completed chores found.</p>
      ) : (
        <ul>
          {familyMemberStats.map(memberStats => (
            <li key={memberStats.id}>
              {memberStats.name}: {memberStats.completedCount} chores completed
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FamilyStatsList;
