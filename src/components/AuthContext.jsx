import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';
const AuthContext = createContext();

export function useAuth() {
 return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          // User document already exists in Firestore
          const userData = userDocSnap.data();
          setCurrentUser({ ...user, ...userData });
        } else {
          // User exists in Auth but not in Firestore (likely signed in via email link)
          console.log('New user signed in via email link. Checking familyMembers collection.');
          const familyMembersQuery = query(collection(db, 'familyMembers'), where('email', '==', user.email));
          const familyMembersSnapshot = await getDocs(familyMembersQuery);

          if (!familyMembersSnapshot.empty) {
            // Found a matching family member document
            const familyMemberDoc = familyMembersSnapshot.docs[0];
            const familyMemberData = familyMemberDoc.data();

            // Update the family member document with the user's UID
            await updateDoc(doc(db, 'familyMembers', familyMemberDoc.id), {
              userId: user.uid, // Link the Auth user to the family member document
            });

            // Create a new document in the 'users' collection for this user
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              name: familyMemberData.name, // Use the name from the family member document
              familyId: familyMemberData.familyId, // Use the familyId from the family member document
              role: familyMemberData.role || 'member', // Use role from family member or default to 'member'
            });

            // Set the current user with the combined data
            setCurrentUser({ ...user, ...familyMemberData, uid: user.uid }); // Ensure uid is correctly set
            console.log('New user successfully linked to family member and user profile created.');

          } else {
            // User exists in Auth but not in Firestore or familyMembers - unexpected state
            console.error('User exists in Auth but not in Firestore or familyMembers collection.', user);
            // You might want to handle this case further, e.g., sign them out or redirect
            setCurrentUser(user);
          }
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
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
export { AuthContext, useAuth, AuthProvider };
