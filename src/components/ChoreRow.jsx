import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { format, parseISO, isValid } from 'date-fns';

const ChoreRow = ({ masterChore, assignedChore, familyMembers, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [choreData, setChoreData] = useState({
        status: 'unassigned',
        assigneeId: 'Not Assigned',
        dueDate: new Date()
    });

    useEffect(() => {
        if (assignedChore) {
            setChoreData({
                status: assignedChore.status || 'unassigned',
                assigneeId: assignedChore.assigneeId || 'Not Assigned',
                dueDate: assignedChore.dueDate?.toDate() || new Date()
            });
        } else {
            // Reset to default if chore is un-assigned
            setChoreData({
                status: 'unassigned',
                assigneeId: 'Not Assigned',
                dueDate: new Date()
            });
        }
    }, [assignedChore]);

    const getFamilyMemberName = (memberId) => {
        if (!memberId || memberId === 'Not Assigned') return 'Not Assigned';
        const member = familyMembers.find(m => m.id === memberId);
        return member ? member.name : 'Unknown';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChoreData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDateChange = (e) => {
        const date = parseISO(e.target.value);
        if(isValid(date)) {
            setChoreData(prev => ({ ...prev, dueDate: date }));
        }
    };

    const handleSave = () => {
        onSave(masterChore, choreData.assigneeId, choreData.dueDate, choreData.status);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Revert changes from assignedChore prop
        if (assignedChore) {
            setChoreData({
                status: assignedChore.status || 'unassigned',
                assigneeId: assignedChore.assigneeId || 'Not Assigned',
                dueDate: assignedChore.dueDate?.toDate() || new Date()
            });
        } else {
             setChoreData({
                status: 'unassigned',
                assigneeId: 'Not Assigned',
                dueDate: new Date()
            });
        }
        setIsEditing(false);
    };
    
    return (
        <div className="grid grid-cols-5 gap-4 items-center p-4">
            <div>{masterChore.name}</div>
            <div>
                {isEditing ? (
                    <select name="status" value={choreData.status} onChange={handleInputChange} className="p-1 border rounded w-full">
                        <option value="assigned">Assigned</option>
                        <option value="unassigned">Unassigned</option>
                    </select>
                ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${choreData.status === 'assigned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {choreData.status}
                    </span>
                )}
            </div>
            <div>
                {isEditing && choreData.status === 'assigned' ? (
                    <select name="assigneeId" value={choreData.assigneeId} onChange={handleInputChange} className="p-1 border rounded w-full">
                        {familyMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                ) : (
                    getFamilyMemberName(choreData.assigneeId)
                )}
            </div>
            <div>
                {isEditing ? (
                    <input type="date" value={format(choreData.dueDate, 'yyyy-MM-dd')} onChange={handleDateChange} className="p-1 border rounded w-full" />
                ) : (
                    isValid(choreData.dueDate) ? format(choreData.dueDate, 'PPP') : 'N/A'
                )}
            </div>
            <div className="flex justify-center items-center space-x-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="text-green-500 hover:text-green-700"><FaCheck /></button>
                        <button onClick={handleCancel} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700"><FaPencilAlt /></button>
                )}
            </div>
        </div>
    );
};

export default ChoreRow;