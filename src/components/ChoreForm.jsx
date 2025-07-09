import React, { useState, useEffect } from 'react';
import { db, addDoc, doc, updateDoc, serverTimestamp, collection } from '../firebase';

function ChoreForm({ familyId, familyMembers, masterChores, editingChore, setEditingChore, cancelEditing }) {
  const [selectedMasterChoreId, setSelectedMasterChoreId] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [assigneeId, setAssigneeId] = useState('');
  const [firstDueDate, setFirstDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (editingChore) {
      setSelectedMasterChoreId(editingChore.masterChoreId);
      setFrequency(editingChore.frequency);
      setAssigneeId(editingChore.assigneeId);
      setFirstDueDate(editingChore.dueDate ? editingChore.dueDate.toDate().toISOString().split('T')[0] : '');
    } else {
      setFrequency('Daily');
      setAssigneeId('');
      setFirstDueDate('');
      setSelectedMasterChoreId(masterChores.length > 0 ? masterChores[0].id : '');
    }
  }, [editingChore, masterChores]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedMasterChoreId || !assigneeId || !frequency || !firstDueDate) {
      setErrorMessage('Please fill in all required fields.');
      setShowError(true);
      return;
    }

    const choreData = {
      familyId,
      masterChoreId: selectedMasterChoreId,
      frequency,
      assigneeId,
      status: 'assigned',
      isCompleted: false,
      createdAt: serverTimestamp(),
      dueDate: new Date(firstDueDate),
    };

    try {
      if (editingChore) {
        const choreRef = doc(db, 'chores', editingChore.id);
        await updateDoc(choreRef, choreData);
        setEditingChore(null);
      } else {
        await addDoc(collection(db, 'chores'), choreData);
      }
      setErrorMessage('');
      setShowError(false);
    } catch (e) {
      console.error('Error saving chore: ', e);
      setErrorMessage(`Error saving chore: ${e.message}`);
      setShowError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingChore ? 'Edit Chore' : 'Create New Chore'}</h2>
      {showError && (
        <div className="error-message">
          {errorMessage}
          <button onClick={() => setShowError(false)}>Close</button>
        </div>
      )}
      <div>
        <label htmlFor="masterChore">Chore</label>
        <select id="masterChore" value={selectedMasterChoreId} onChange={(e) => setSelectedMasterChoreId(e.target.value)} required>
          <option value="">Select Chore</option>
          {masterChores.map((chore) => (<option key={chore.id} value={chore.id}>{chore.name}</option>))}
        </select>
      </div>
      <div>
        <label htmlFor="frequency">Frequency</label>
        <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Fortnightly">Bi-Weekly</option>
          <option value="Once">Once</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>
      <div>
        <label htmlFor="assignee">Assignee</label>
        <select id="assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required>
          <option value="">Select Assignee</option>
          {familyMembers.map((member) => (<option key={member.id} value={member.id}>{member.name}</option>))}
        </select>
      </div>
      <div>
        <label htmlFor="first-due-date">First Due Date</label>
        <input type="date" id="first-due-date" value={firstDueDate} onChange={(e) => setFirstDueDate(e.target.value)} required />
      </div>
      <button type="submit">{editingChore ? 'Update Chore' : 'Add Chore'}</button>
      {editingChore && <button type="button" onClick={cancelEditing}>Cancel</button>}
    </form>
  );
}

export default ChoreForm;
