import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query, where, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import ChoreRow from './ChoreRow';

const ChoreManagementList = () => {
    const { currentUser } = useAuth();
    const [masterChores, setMasterChores] = useState([]);
    const [chores, setChores] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();

    useEffect(() => {
        if (!currentUser?.familyId) {
            setLoading(false);
            return;
        }

        const masterChoresQuery = query(collection(db, 'masterChores'), where('familyId', '==', currentUser.familyId));
        const unsubscribeMasterChores = onSnapshot(masterChoresQuery, snapshot => {
            setMasterChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const choresQuery = query(collection(db, 'chores'), where('familyId', '==', currentUser.familyId));
        const unsubscribeChores = onSnapshot(choresQuery, snapshot => {
            setChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const familyMembersQuery = query(collection(db, 'familyMembers'), where('familyId', '==', currentUser.familyId));
        const unsubscribeFamilyMembers = onSnapshot(familyMembersQuery, snapshot => {
            setFamilyMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeMasterChores();
            unsubscribeChores();
            unsubscribeFamilyMembers();
        };
    }, [currentUser?.familyId, db]);

    const handleSave = async (masterChore, assigneeId, dueDate, status) => {
        const existingChore = chores.find(c => c.masterChoreId === masterChore.id);

        if (status === 'assigned') {
            const data = {
                assigneeId,
                dueDate,
                status: 'assigned',
                masterChoreId: masterChore.id,
                familyId: currentUser.familyId,
                lastUpdated: serverTimestamp()
            };

            if (existingChore) {
                const choreRef = doc(db, 'chores', existingChore.id);
                await updateDoc(choreRef, data);
            } else {
                await addDoc(collection(db, 'chores'), { ...data, createdAt: serverTimestamp() });
            }
        } else { // Unassigned
            if (existingChore) {
                const choreRef = doc(db, 'chores', existingChore.id);
                await deleteDoc(choreRef);
            }
        }
    };

    if (loading) {
        return <p>Loading chores...</p>;
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Chore Management</h2>
            <div className="min-w-full">
                <div className="grid grid-cols-5 gap-4 bg-gray-200 p-4 rounded-t-lg font-bold">
                    <div>Chore</div>
                    <div>Status</div>
                    <div>Assigned To</div>
                    <div>Due Date</div>
                    <div className="text-center">Edit</div>
                </div>
                <div className="divide-y divide-gray-200">
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
                </div>
            </div>
        </div>
    );
};

export default ChoreManagementList;