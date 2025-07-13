import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCurrentUser({ ...user, ...userData });
        } else {
          // New user sign-in, check for an invitation
          const familyMembersQuery = query(collection(db, 'familyMembers'), where('email', '==', user.email));
          const familyMembersSnapshot = await getDocs(familyMembersQuery);

          if (!familyMembersSnapshot.empty) {
            const familyMemberDoc = familyMembersSnapshot.docs[0];
            const familyMemberData = familyMemberDoc.data();

            // Link the auth user to the family member document
            await updateDoc(doc(db, 'familyMembers', familyMemberDoc.id), {
              userId: user.uid,
            });

            // Create a new document in the 'users' collection
            const newUserProfile = {
              uid: user.uid,
              email: user.email,
              name: familyMemberData.name,
              familyId: familyMemberData.familyId,
              role: familyMemberData.role || 'member',
            };
            await setDoc(doc(db, 'users', user.uid), newUserProfile);
            
            setCurrentUser({ ...user, ...newUserProfile });
          } else {
            setCurrentUser(user);
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
