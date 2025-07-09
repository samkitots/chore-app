import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, where, doc, updateDoc, addDoc, deleteDoc } from '../firebase';
import { useAuth } from './AuthContext';
import ChoreRow from './ChoreRow';

const ChoreManagementList = () => {
    const { currentUser } = useAuth();
    const [masterChores, setMasterChores] = useState([]);
    const [chores, setChores] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.familyId) return;

        const masterChoresQuery = query(collection(db, 'masterChores'), where('familyId', '==', currentUser.familyId));
        const unsubscribeMasterChores = onSnapshot(masterChoresQuery, snapshot => {
            setMasterChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const choresQuery = query(collection(db, 'chores'), where('familyId', '==', currentUser.familyId));
        const unsubscribeChores = onSnapshot(choresQuery, snapshot => {
            setChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const familyMembersQuery = query(collection(db, 'familyMembers'), where('familyId', '==', currentUser.familyId));
        const unsubscribeFamilyMembers = onSnapshot(familyMembersQuery, snapshot => {
            setFamilyMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        setLoading(false);

        return () => {
            unsubscribeMasterChores();
            unsubscribeChores();
            unsubscribeFamilyMembers();
        };
    }, [currentUser.familyId]);

    const handleSave = async (masterChore, assignedTo, dueDate, status) => {
        const existingChore = chores.find(c => c.masterChoreId === masterChore.id);

        if (status === 'assigned') {
            if (existingChore) {
                // Update existing chore
                const choreRef = doc(db, 'chores', existingChore.id);
                await updateDoc(choreRef, {
                    assignedTo: assignedTo,
                    dueDate: dueDate,
                    status: 'assigned',
                });
            } else {
                // Create new chore
                await addDoc(collection(db, 'chores'), {
                    masterChoreId: masterChore.id,
                    familyId: currentUser.familyId,
                    assignedTo: assignedTo,
                    dueDate: dueDate,
                    status: 'assigned',
                    isCompleted: false,
                    pendingApproval: false,
                });
            }
        } else { // Unassigned
            if (existingChore) {
                // Delete existing chore
                const choreRef = doc(db, 'chores', existingChore.id);
                await deleteDoc(choreRef);
            }
        }
    };

    if (loading) {
        return <p>Loading chores...</p>;
    }

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold my-4">Chore Management</h2>
            <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="w-1/4 py-2 px-4 text-left">Chore</th>
                        <th className="w-1/4 py-2 px-4 text-left">Status</th>
                        <th className="w-1/4 py-2 px-4 text-left">Assigned To</th>
                        <th className="w-1/4 py-2 px-4 text-left">Due Date</th>
                        <th className="w-1/6 py-2 px-4 text-center">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {masterChores.map(masterChore => {
                        const assignedChore = chores.find(c => c.masterChoreId === masterChore.id);
                        return (
                            <ChoreRow
                                key={masterChore.id}
                                masterChore={masterChore}
                                assignedChore={assignedChore}
                                familyMembers={familyMembers}
                                onSave={handleSave}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ChoreManagementList;
