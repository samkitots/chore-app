import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { format, differenceInCalendarDays, addDays } from 'date-fns';

const ChoreRow = ({ masterChore, assignedChore, familyMembers, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(assignedChore ? 'assigned' : 'unassigned');
    const [assignedTo, setAssignedTo] = useState(assignedChore?.assignedTo || 'Not Assigned');
    const [dueDate, setDueDate] = useState(assignedChore?.dueDate?.toDate() || addDays(new Date(), 7));

    const getFamilyMemberName = (memberId) => {
        if (!memberId || memberId === 'Not Assigned') return 'Not Assigned';
        const member = familyMembers.find(m => m.id === memberId);
        return member ? member.name : 'Unknown';
    };

    const formatDueDate = (date) => {
        if (!date) return 'N/A';
        const today = new Date();
        const diff = differenceInCalendarDays(date, today);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        if (diff < -1) return `${Math.abs(diff)} days overdue`;
        return `In ${diff} days`;
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset state to original
        setStatus(assignedChore ? 'assigned' : 'unassigned');
        setAssignedTo(assignedChore?.assignedTo || 'Not Assigned');
        setDueDate(assignedChore?.dueDate?.toDate() || addDays(new Date(), 7));
    };

    const handleSave = () => {
        onSave(masterChore, assignedTo, dueDate, status);
        setIsEditing(false);
    };

    useEffect(() => {
        if (status === 'unassigned') {
            setAssignedTo('Not Assigned');
        } else if (status === 'assigned' && assignedTo === 'Not Assigned') {
            setAssignedTo(familyMembers[0]?.id || '');
        }
    }, [status, familyMembers]);

    return (
        <tr className="border-b">
            <td className="py-2 px-4">{masterChore.name}</td>
            <td className="py-2 px-4">
                {isEditing ? (
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-1 border rounded">
                        <option value="assigned">Assigned</option>
                        <option value="unassigned">Unassigned</option>
                    </select>
                ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'assigned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {status === 'assigned' ? 'Assigned' : 'Unassigned'}
                    </span>
                )}
            </td>
            <td className="py-2 px-4">
                {isEditing && status === 'assigned' ? (
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="p-1 border rounded">
                        {familyMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                ) : (
                    getFamilyMemberName(assignedTo)
                )}
            </td>
            <td className="py-2 px-4">
                {isEditing ? (
                    <input type="date" value={format(dueDate, 'yyyy-MM-dd')} onChange={(e) => setDueDate(new Date(e.target.value))} className="p-1 border rounded" />
                ) : (
                    formatDueDate(assignedChore?.dueDate?.toDate())
                )}
            </td>
            <td className="py-2 px-4 text-center">
                {isEditing ? (
                    <div className="flex justify-center items-center space-x-2">
                        <button onClick={handleSave} className="text-green-500 hover:text-green-700">
                            <FaCheck />
                        </button>
                        <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                            <FaTimes />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleEdit} className="text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                )}
            </td>
        </tr>
    );
};

export default ChoreRow;
