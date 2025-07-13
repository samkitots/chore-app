import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';
import ParentDashboard from './ParentDashboard';
import MemberDashboard from './MemberDashboard';

function Dashboard() {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    masterChores: [],
    familyMembers: [],
    chores: [],
  });
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    if (!currentUser?.familyId) {
      setLoading(false);
      return;
    }

    const queries = {
      masterChores: query(collection(db, 'masterChores'), where('familyId', '==', currentUser.familyId)),
      familyMembers: query(collection(db, 'familyMembers'), where('familyId', '==', currentUser.familyId)),
      chores: query(collection(db, 'chores'), where('familyId', '==', currentUser.familyId)),
    };

    const unsubscribes = Object.entries(queries).map(([key, q]) => 
      onSnapshot(q, (snapshot) => {
        setDashboardData(prevData => ({
          ...prevData,
          [key]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        }));
      })
    );
    
    // A simple way to check for initial data load.
    // This could be improved with Promise.all if we were fetching once,
    // but with listeners, we'll just wait for the first batch.
    const loadingTimeout = setTimeout(() => setLoading(false), 2000); // Failsafe timeout

    const initialLoadCheck = () => {
        if(dashboardData.masterChores.length > 0 && dashboardData.familyMembers.length > 0) {
            setLoading(false);
        }
    }
    // This is a simplified check. A more robust solution might be needed
    // depending on specific app requirements, e.g., waiting for all listeners to fire at least once.
    initialLoadCheck();


    return () => {
      unsubscribes.forEach(unsub => unsub());
      clearTimeout(loadingTimeout);
    };
  }, [currentUser, db]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!currentUser) {
    return <div>Please log in.</div>;
  }
  
  // Assuming 'Parent' is a role that has admin-like privileges
  const isAdmin = currentUser.role === 'Parent' || currentUser.role === 'admin';

  return isAdmin ? (
    <ParentDashboard {...dashboardData} />
  ) : (
    <MemberDashboard {...dashboardData} user={currentUser} />
  );
}

export default Dashboard;