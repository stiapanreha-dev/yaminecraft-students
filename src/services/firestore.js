import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Users
export const createUser = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getUser = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return { user: { id: docSnap.id, ...docSnap.data() }, error: null };
    }
    return { user: null, error: 'User not found' };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const getUserById = async (uid) => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() };
  }
  throw new Error('User not found');
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

export const updateUser = async (uid, userData) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getAllStudents = async () => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { students, error: null };
  } catch (error) {
    return { students: [], error: error.message };
  }
};

// Achievements
export const createAchievement = async (achievementData) => {
  try {
    const docRef = doc(collection(db, 'achievements'));
    await setDoc(docRef, {
      ...achievementData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const q = query(
      collection(db, 'achievements'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const achievements = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { achievements, error: null };
  } catch (error) {
    return { achievements: [], error: error.message };
  }
};

export const getAchievementsByUserId = async (userId) => {
  const q = query(
    collection(db, 'achievements'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAchievement = async (achievementId, data) => {
  try {
    await updateDoc(doc(db, 'achievements', achievementId), data);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteAchievement = async (achievementId) => {
  try {
    await deleteDoc(doc(db, 'achievements', achievementId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Events
export const createEvent = async (eventData) => {
  try {
    const docRef = doc(collection(db, 'events'));
    await setDoc(docRef, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getAllEvents = async () => {
  try {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { events, error: null };
  } catch (error) {
    return { events: [], error: error.message };
  }
};

export const getEvents = async () => {
  const q = query(collection(db, 'events'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEvent = async (eventId, eventData) => {
  try {
    await updateDoc(doc(db, 'events', eventId), {
      ...eventData,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Ratings
export const getUserRating = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'ratings', userId));
    if (docSnap.exists()) {
      return { rating: { id: docSnap.id, ...docSnap.data() }, error: null };
    }
    return { rating: null, error: 'Rating not found' };
  } catch (error) {
    return { rating: null, error: error.message };
  }
};

export const getRatingByUserId = async (userId) => {
  const docSnap = await getDoc(doc(db, 'ratings', userId));
  if (docSnap.exists()) {
    return { userId: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getTopRatings = async (limitCount = 10, period = 'all') => {
  try {
    const orderField = period === 'month' ? 'monthPoints' : period === 'year' ? 'yearPoints' : 'totalPoints';
    const q = query(
      collection(db, 'ratings'),
      orderBy(orderField, 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const ratings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { ratings, error: null };
  } catch (error) {
    return { ratings: [], error: error.message };
  }
};

export const updateRating = async (userId, ratingData) => {
  try {
    await setDoc(doc(db, 'ratings', userId), {
      ...ratingData,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
