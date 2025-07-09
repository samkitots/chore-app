import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp, 
  Timestamp,
  onSnapshot,
  query,
  where,
  updateDoc  // <-- Added
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDzLwEvR1FnO1FOsvgDLrS0tCXwCTJcDP8",
  authDomain: "choreapp-c36da.firebaseapp.com",
  projectId: "choreapp-c36da",
  storageBucket: "choreapp-c36da.firebasestorage.app",
  messagingSenderId: "835511202931",
  appId: "1:835511202931:web:4246f3fb38f6799996e606"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

/**
 * Signs up a user with email, password, and name, and associates them with a family.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} name - The user's first name.
 * @param {string} familyId - The ID of the family to associate the user with.
 * @returns {Promise<UserCredential>}
 */
const signUpWithEmail = async (email, password, name, familyId = "defaultFamily") => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create a user document in the 'users' collection with the user's UID as the document ID
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    name: name,
    role: 'member', // Default role for new users
    familyId: familyId, // Associate user with a family
    createdAt: serverTimestamp()
  });

  // Also create a corresponding document in the 'familyMembers' collection
  await setDoc(doc(db, 'familyMembers', user.uid), {
    uid: user.uid,
    name: name,
    familyId: familyId,
    createdAt: serverTimestamp()
  });

  return userCredential;
};

/**
 * Fetches a user's profile information (including role and familyId) from Firestore.
 * @param {string} uid - The user's unique ID.
 * @returns {Promise<object|null>} - The user's profile data or null if not found.
 */
const getUserProfile = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return userDocSnap.data(); // Returns the whole user document { uid, name, email, role, familyId }
  } else {
    console.error("No such user document!");
    return null;
  }
};

/**
 * Signs in a user with their email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>}
 */
const signInWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export { db, auth, analytics, signInWithEmail, signUpWithEmail, getUserProfile, Timestamp, serverTimestamp, collection, doc, getDocs, onSnapshot, query, where, updateDoc, addDoc };
