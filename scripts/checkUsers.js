import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo',
  authDomain: 'yaminecraft-students.firebaseapp.com',
  projectId: 'yaminecraft-students'
});

const db = getFirestore(app);

const usersSnapshot = await getDocs(collection(db, 'users'));
console.log('Total users:', usersSnapshot.size);
console.log('');

usersSnapshot.forEach(doc => {
  const data = doc.data();
  console.log('---');
  console.log('UID:', doc.id);
  console.log('Email:', data.email);
  console.log('Role:', data.role);
  console.log('Name:', data.profile?.firstName, data.profile?.lastName);
  console.log('Class:', data.profile?.class);
});

process.exit(0);
