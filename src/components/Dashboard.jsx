import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, collection, onSnapshot, query, where } from '../firebase';
import ParentDashboard from './ParentDashboard';
import MemberDashboard from './MemberDashboard';

function Dashboard() {
  const { currentUser } = useAuth();
  const [masterChores, setMasterChores] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [chores, setChores] = useState([]); // State for all chores
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !currentUser.familyId) {
      setLoading(false);
      return;
    }

    // Listener for Master Chores
    const masterChoresQuery = collection(db, 'masterChores');
    const unsubscribeMasterChores = onSnapshot(masterChoresQuery, (snapshot) => {
      setMasterChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listener for Family Members
    const familyMembersQuery = query(collection(db, 'familyMembers'), where('familyId', '==', currentUser.familyId));
    const unsubscribeFamilyMembers = onSnapshot(familyMembersQuery, (snapshot) => {
      setFamilyMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listener for All Chores in the family
    const choresQuery = query(collection(db, 'chores'), where('familyId', '==', currentUser.familyId));
    const unsubscribeChores = onSnapshot(choresQuery, (snapshot) => {
      setChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false); // Set loading to false after all data is fetched
    });

    // Cleanup function to unsubscribe from all listeners on component unmount
    return () => {
      unsubscribeMasterChores();
      unsubscribeFamilyMembers();
      unsubscribeChores();
    };
  }, [currentUser]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!currentUser) {
    return <div>Please log in.</div>;
  }

  // Pass all necessary data down to the specific dashboards
  return currentUser.role === 'admin' ? (
    <ParentDashboard
      currentUser={currentUser}
      masterChores={masterChores}
      familyMembers={familyMembers}
      chores={chores} // Pass chores down
    />
  ) : (
    <MemberDashboard
      currentUser={currentUser}
      masterChores={masterChores}
      familyMembers={familyMembers}
      chores={chores} // Pass chores down
    />
  );
}

export default Dashboard;
